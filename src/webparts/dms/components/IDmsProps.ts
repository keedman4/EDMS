import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PageContext } from "@microsoft/sp-page-context";
export interface IDmsProps {
  description: string;
  context: WebPartContext;
  pageContext: PageContext;
  siteUrl: string,

}
