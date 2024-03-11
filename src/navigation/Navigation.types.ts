export type ModalStackRoutes = {
  BarCode: { onBarCodeScanned: (data: any) => void; };
  RootStack: undefined;
};

export type HomeStackRoutes = {
  Home: undefined;
  ProjectsList: { accountName: string };
  SnacksList: { accountName: string };
  ProjectDetails: { id: string };
  Branches: { appId: string };
  BranchDetails: { appId: string; branchName: string };
  Account: undefined;
  Project: { id: string };
  FeedbackForm: undefined;
  NewGoods: undefined;
};

export type SettingsStackRoutes = {
  Settings: undefined;
  DeleteAccount: { viewerUsername: string };
};

export type Routes = SettingsStackRoutes & HomeStackRoutes & ModalStackRoutes;

export type DiagnosticsStackRoutes = {
  Diagnostics: object;
  Audio: object;
  Location: object;
  Geofencing: object;
};
