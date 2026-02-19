import React from "react";

import { hubspot } from "@hubspot/ui-extensions";
import TabsContainer from "./components/Tabs";

hubspot.extend(({ context, actions }) => (
  <TabsContainer context={context} actions={actions} />
));
