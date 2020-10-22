import React from "react";
import { useDropzone } from "react-dropzone";
import { Button, Box, Heading, List, Text, Table, Link } from "bumbag";
import { useCallback } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/hook";
import { resolveIpfsUrl } from "../../eos/storage";

const ExistingUploads: React.FC<{}> = ({}) => {
  const userStore = useStore(store => store.userStore);

  if (!userStore.userData) return null;

  const sortedFiles = userStore.userData.files.slice().sort(
    (f1, f2) =>
      new Date(f2.uploadedAt).getTime() - new Date(f1.uploadedAt).getTime(),
  );
  const mbUsed = (userStore.userData.bytesPinned / (1024 * 1024)).toFixed(2);

  return (
    <Box marginTop="major-6">
      <Heading use="h2" fontSize="300" textAlign="center" marginBottom="major-2">
        {`Pinned Files (${mbUsed}MB / 1024 MB)`}
      </Heading>
      <Table variant="minimal">
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Size</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell textAlign="right">Download</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sortedFiles.map((file, index) => (
            <Table.Row key={index}>
              <Table.Cell wordBreak="break-all" fontWeight="600">{file.name}</Table.Cell>
              <Table.Cell>{(file.size / 1024).toFixed(0)}KB</Table.Cell>
              <Table.Cell>
                {new Date(file.uploadedAt).toLocaleString()}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Link href={resolveIpfsUrl(file.ipfsHash)}>
                  {`${file.ipfsHash.slice(0, 8)}..${file.ipfsHash.slice(-4)}`}
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
};

export default observer(ExistingUploads);
