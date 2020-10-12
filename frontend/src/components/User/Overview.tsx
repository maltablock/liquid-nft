import { Alert, Box, Container } from "bumbag";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useStore } from "../../store/hook";
import FileUpload from "./FileUpload";
import PendingUploads from "./PendingUploads";

const UserOverview: React.FC<{}> = props => {
  const [userStore] = useStore(store => [store.userStore]);

  if (!userStore.userData)
    return (
      <Alert title="Login Required">
        Log in to upload new files and manage your IPFS uploads.
      </Alert>
    );

  return (
    <Box>
      <FileUpload
        onUpload={userStore.uploadFiles}
        disabled={userStore.isUploading}
      />
      <PendingUploads />
    </Box>
  );
};

export default observer(UserOverview);
