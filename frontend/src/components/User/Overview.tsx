import { Alert, Box, Container, Flex } from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useStore } from "../../store/hook";
import FileUpload from "./FileUpload";
import PendingUploads from "./PendingUploads";
import ExistingUploads from "./ExistingUploads";

const UserOverview: React.FC<{}> = props => {
  const [userStore] = useStore(store => [store.userStore]);

  if (!userStore.userData)
    return (
      <Alert title="Login Required">
        Log in to upload new files and manage your IPFS uploads.
      </Alert>
    );

  return (
    <Flex flexDirection="column" alignItems="center">
      <FileUpload
        onUpload={userStore.uploadFiles}
        disabled={userStore.isUploading}
      />
      <PendingUploads />
      <ExistingUploads />
    </Flex >
  );
};

export default observer(UserOverview);
