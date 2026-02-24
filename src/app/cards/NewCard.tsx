import React from "react";
// import { getTranslation } from "./translations";
import { hubspot } from "@hubspot/ui-extensions";
import TabsContainer from "./components/Tabs";

hubspot.extend(({ context, actions }) => (
  <TabsContainer
    context={context}
    actions={actions}
  // t={(key: string) => getTranslation(context.user.locale || "en", key)}
  />
));
