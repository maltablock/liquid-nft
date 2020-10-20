import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Box, Heading, List, Text, Table } from "bumbag";
import { useCallback } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/hook";

const PendingUploads: React.FC<{}> = ({}) => {
  const userStore = useStore(store => store.userStore);

  if (!userStore.isUploading) return null;

  return (
    <Box marginTop="major-6">
      <Heading use="h2" fontSize="200" textAlign="center">
        Pending Uploads
      </Heading>
      <Table variant="minimal">
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell textAlign="right">Size</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {userStore.pendingUploads.map((upload, index) => (
            <Table.Row key={index}>
              <Table.Cell wordBreak="break-all" fontWeight="600">{upload.fileBlob.name}</Table.Cell>
              <Table.Cell textAlign="right">
                {(upload.fileBlob.size / 1024).toFixed(0)}KB
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default observer(PendingUploads);
