import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Document } from "mongoose";
import { ServerContext } from "../../context";
import { axiosErrorToaster, MICO, OFAB } from "../../";
import { Add } from "@mui/icons-material";
import { TODO, guessValueType } from "@w3notif/shared";

type ActionModal = (closeModal: () => void, id?: string) => ReactNode;

export interface GenericTableProps<D> {
  endpoint?: string;
  readyData?: D[];
  customColumns?: { path: string[]; name: string }[];
  actions: {
    name: string;
    icon: ReactNode;
    modal: ActionModal;
  }[];
  fab?: {
    modal: ActionModal;
  };
  customRowId?: string;
}

const autoSumColumn = (dataArray: TODO[]) => {
  const res = new Set<string>();
  dataArray?.forEach((elm) => Object.keys(elm).forEach((key) => res.add(key)));
  return [...res];
};

export const GenericTable = <D extends Document>({
  endpoint,
  readyData,
  customColumns,
  actions,
  fab,
  customRowId,
}: GenericTableProps<D>) => {
  const [data, setData] = useState<D[]>([]);
  const server = useContext(ServerContext);
  const [openModal, setOpenModal] = useState<number>();
  const [selectedId, setSelectedId] = useState("");

  const fetchData = useCallback(async () => {
    try {
      if (server) {
        let data;
        if (endpoint) data = (await server.axiosInstance.get(endpoint)).data;
        else data = readyData;
        setData(data ? data : data);
      }
    } catch (e) {
      axiosErrorToaster(e);
    }
  }, [server, endpoint, readyData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const closeModal = () => {
    setOpenModal(undefined);
    fetchData();
  };

  const columns =
    customColumns ||
    autoSumColumn(data).map((key) => ({
      path: [key],
      name: key,
    }));

  return (
    <Box overflow="scroll">
      {openModal !== undefined && openModal === -1
        ? fab?.modal(closeModal, selectedId)
        : actions[openModal as number] &&
          actions[openModal as number].modal(closeModal, selectedId)}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(({ name }) => (
              <TableCell key={name}>{name}</TableCell>
            ))}
            {actions?.map(({ name }) => (
              <TableCell key={name}>{name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, i) => (
            <TableRow key={i}>
              {columns
                .map(({ path }) => {
                  let data = row;
                  path.forEach(
                    (key) =>
                      (data = (data as TODO)
                        ? (data as TODO)[key]
                        : (data as TODO)),
                  );
                  return data;
                })
                .map((value, j) => (
                  <TableCell key={`${i}-${j}`}>
                    {(Array.isArray(value) ? value : [value])
                      .map((item) => guessValueType(item))
                      .join(", ")}
                  </TableCell>
                ))}
              {actions.map(({ icon }, i) => (
                <TableCell key={i}>
                  <IconButton
                    onClick={() => {
                      setOpenModal(i);
                      setSelectedId(
                        (row as TODO)[customRowId || "_id"].toString(),
                      );
                    }}
                  >
                    <MICO>{icon}</MICO>
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          ))}
          {fab && (
            <OFAB onClick={() => setOpenModal(-1)}>
              <MICO>
                <Add />
              </MICO>
            </OFAB>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
