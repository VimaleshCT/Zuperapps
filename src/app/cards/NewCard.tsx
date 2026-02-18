import React from "react";

import { hubspot } from "@hubspot/ui-extensions";
import TabsContainer from "./components/Tabs";

// (hubspot.extend as any)("crm.record.tab", ({ context }: any) => {
//   return <TabsContainer context={context} />;
// });

hubspot.extend(({ context, actions }) => (
  <TabsContainer context={context} actions={actions} />
));
