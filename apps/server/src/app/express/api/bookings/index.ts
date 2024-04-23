import { Response, Router } from "express";
import { AuthenticatedRequest } from "../../middleware";
import bookingModel from "../../../mongo/bookings/bookingModel";
import {
  Asset,
  Booking,
  BookingDetails,
  Company,
  RequestStatus,
  TODO,
  User,
} from "@w3notif/shared";
import companyModel from "../../../mongo/assets/companyModel";
import assetModel from "../../../mongo/assets/assetModel";
import userModel from "../../../mongo/auth/userModel";
import PubSub from "pubsub-js";
import NodeCache from "node-cache";
import { Model } from "mongoose";

const stdTTL = 7200;
const cache = new NodeCache({ stdTTL });

const router = Router();

const getAssetsOfHost = async (hostId: string): Promise<Asset[]> => {
  const options = (await companyModel().find({ host: hostId })).map(
    (company) => ({
      companyId: company._id,
    }),
  );
  return options.length > 0
    ? await assetModel().find({
        $or: options,
      })
    : await assetModel().find();
};

const authHost = async (assetId: string, hostId: string): Promise<boolean> =>
  (await getAssetsOfHost(hostId)).some(
    (asset) => asset._id.toString() === assetId,
  );

const getCachedAssetsOfHost = async (userId: string): Promise<Asset[]> => {
  const key = `assetsOfHost-${userId}`;
  const cachedAssets: Asset[] | undefined = cache.get(key);
  if (cachedAssets) return cachedAssets;
  const assets = await getAssetsOfHost(userId);
  cache.set(key, assets);
  return assets;
};

const getCachedModelById = async <Doc>(
  model: Model<Doc>,
  id: string,
  prefix: string,
): Promise<Doc | undefined> => {
  const key = `${prefix}-${id}`;
  const cachedResult: Doc | undefined = cache.get(key);
  if (cachedResult) return cachedResult;
  const result = (await model.findById(id)) as Doc | undefined;
  cache.set(key, result);
  return result;
};

const addNamesToBookings = async (
  bookings: Booking[],
  userR: User | null,
): Promise<(Booking & { name: string })[] | null> =>
  !userR
    ? (userR as null)
    : await Promise.all(
        bookings.map(async (booking) => {
          const asset = await getCachedModelById<Asset>(
            assetModel(),
            booking?.asset?.toString() || "",
            "asset",
          );
          const company = await getCachedModelById<Company>(
            companyModel(),
            asset?.companyId?.toString() || "",
            "company",
          );
          const user = await getCachedModelById<User>(
            userModel(),
            userR.type === "host"
              ? booking.guest?.toString() || ""
              : company?.host?.toString() || "",
            "user",
          );
          return {
            ...(booking as unknown as { _doc: Booking })._doc,
            name: user?.name || "",
          } as Booking & { name: string };
        }),
      );

router.get("/", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    const assetsOfHost = await getCachedAssetsOfHost(req.user._id.toString());
    const enhancedBookings = await addNamesToBookings(
      await bookingModel().find({
        $or: [
          { guest: req.user._id },
          ...(assetsOfHost
            ? assetsOfHost.map((asset) => ({ asset: asset._id }))
            : []),
        ],
        requestStatus: {
          $nin: [
            RequestStatus.Archived,
            RequestStatus.Declined,
            RequestStatus.Draft,
          ],
        },
      }),
      req.user,
    );
    return res.status(200).json(enhancedBookings);
  } catch (e) {
    next(e);
  }
});

router.get(
  "/draftsByAssetId/:assetId",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) return res.status(401).send("not logged in");
      if (!req.params.assetId) return res.status(400).send("not id received");
      return res.status(200).json(
        await addNamesToBookings(
          await bookingModel().find({
            asset: req.params.assetId,
            requestStatus: RequestStatus.Draft,
          }),
          req.user,
        ),
      );
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  "/draftsByBookingId/:bookingId",
  async (req: AuthenticatedRequest, res, next) => {
    try {
      if (!req.user) return res.status(401).send("not logged in");
      if (!req.params.bookingId) return res.status(400).send("not id received");
      return res
        .status(200)
        .json(
          await addNamesToBookings(
            [await bookingModel().findById(req.params.bookingId)],
            req.user,
          ),
        );
    } catch (e) {
      next(e);
    }
  },
);

router.post("/:assetId", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.assetId)
      return res.status(400).send("no asset id received");
    const Booking = bookingModel();
    const b = await new Booking({
      guest: req.user._id,
      asset: req.params.assetId,
      ...(req.body as BookingDetails),
      requestStatus: RequestStatus.Draft,
    }).save();
    return res.status(201).send(b._id.toString());
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (booking.guest.toString() !== req.user._id.toString())
      return res.status(401).send("not your booking");
    Object.keys(req.body as BookingDetails).forEach((key) => {
      booking[key] = req.body[key];
    });
    (booking.requestStatus = RequestStatus.Draft), await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (booking.guest.toString() !== req.user._id.toString())
      return res.status(401).send("not your booking");
    (booking.requestStatus = RequestStatus.Archived), await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.post("/sendOffer/:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (booking.guest.toString() !== req.user._id.toString())
      return res.status(401).send("not your booking");
    booking.requestStatus = RequestStatus.Offer;
    (booking.readTS = [...booking.readTS, 0]), await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.put("/read:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (
      !authHost(booking.asset.toString(), req.user._id.toString()) &&
      !booking.guest.toString() !== req.user._id.toString()
    )
      return res.status(401).send("not your booking");
    if (booking.readTS[booking.readTS.length - 1] !== 0)
      return res.status(400).send("Already read!");
    booking.readTS[booking.readTS.length - 1] = Date.now();
    await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.delete("/decline:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (!authHost(booking.asset.toString(), req.user._id.toString()))
      return res.status(401).send("not your booking");
    (booking.requestStatus = RequestStatus.Declined), await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.put("/amend:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (booking.requestStatus !== RequestStatus.CounterOffer)
      return res.status(400).send("Not on counteroffer status");
    if (booking.guest.toString() !== req.user._id.toString())
      return res.status(401).send("not your booking");
    Object.keys(req.body as BookingDetails).forEach((key) => {
      booking[key] = req.body[key];
    });
    (booking.requestStatus = RequestStatus.Offer), await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.put("/counterOffer:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (booking.requestStatus !== RequestStatus.Offer)
      return res.status(400).send("Not on offer status");
    if (!authHost(booking.asset.toString(), req.user._id.toString()))
      return res.status(401).send("not your booking");
    booking.requestStatus = RequestStatus.CounterOffer;
    Object.keys(req.body as BookingDetails).forEach((key) => {
      booking[key] = req.body[key];
    });
    (booking.readTS = [...booking.readTS, 0]), await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.put("/accept:id", async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).send("not logged in");
    if (!req.params.id) return res.status(400).send("No id received");
    const Booking = bookingModel();
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("No booking with this id found");
    if (!authHost(booking.asset.toString(), req.user._id.toString()))
      return res.status(401).send("not your booking");
    booking.requestStatus = RequestStatus.Active;
    (booking.readTS = [...booking.readTS, 0]), await booking.save();
    return res.status(201).send("Success");
  } catch (e) {
    next(e);
  }
});

router.get("/subscribe", (req: AuthenticatedRequest, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const token = PubSub.subscribe("bookings", (_, data) =>
    res.write(`data: ${JSON.stringify({ message: data })}\n\n`),
  );

  req.on("close", () => {
    PubSub.unsubscribe(token);
  });
});

export default router;
