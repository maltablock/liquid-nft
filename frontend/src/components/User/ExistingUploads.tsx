import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Box,
  Heading,
  List,
  Text,
  Table,
  Link,
  Alert,
  applyTheme,
} from "bumbag";
import { useCallback } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../store/hook";
import { resolveIpfsUrl } from "../../eos/storage";

export const StyledTable = applyTheme(Table, {
  styles: {
    base: (props: any) => ({
      borderCollapse: `separate`,
      borderSpacing: `0 2px`,
    }),
  },
  defaultProps: {
    size: `small`,
  },
});

const ExistingUploads: React.FC<{}> = ({}) => {
  const userStore = useStore(store => store.userStore);

  if (!userStore.userData) return null;

  const sortedFiles = userStore.userData.files
    .slice()
    .sort(
      (f1, f2) =>
        new Date(f2.uploadedAt).getTime() - new Date(f1.uploadedAt).getTime(),
    );
  const mbUsed = (userStore.userData.bytesPinned / (1024 * 1024)).toFixed(2);

  const table = (
    <StyledTable
      variant="minimal"
    >
      <Table.Head>
        <Table.Row>
          <Table.HeadCell color="secondary">Name</Table.HeadCell>
          <Table.HeadCell color="secondary">Size</Table.HeadCell>
          <Table.HeadCell color="secondary">Date</Table.HeadCell>
          <Table.HeadCell color="secondary" textAlign="right">
            Download
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sortedFiles.map((file, index) => (
          <Table.Row backgroundColor="#024258" key={index}>
            <Table.Cell wordBreak="break-all" fontWeight="600">
              {file.name}
            </Table.Cell>
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
    </StyledTable>
  );

  return (
    <Box marginTop="major-6">
      <Heading
        use="h2"
        fontSize="300"
        textAlign="center"
        marginBottom="major-2"
        color="secondary"
      >
        {`Pinned Files (${mbUsed}MB / 1024 MB)`}
      </Heading>
      {sortedFiles.length > 0 ? (
        table
      ) : (
        <Alert variant="info">Your uploaded files will be listed here</Alert>
      )}
    </Box>
  );
};

export default observer(ExistingUploads);
