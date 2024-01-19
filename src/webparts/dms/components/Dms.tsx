import * as React from "react";
//import styles from './Dms.module.scss';
import { IDmsProps } from "./IDmsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import * as jQuery from "jquery";
import { HashRouter, Route, Switch } from "react-router-dom";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { sp } from "@pnp/sp";

import HomeScreen from "./modules/HomeScreen/index";
import SingleScreen from "./modules/HomeScreen/Single";

export default class Dms extends React.Component<IDmsProps, {}> {
  public render(): React.ReactElement<IDmsProps> {
    jQuery("#workbenchPageContent").prop("style", "max-width: none");
    jQuery(".SPCanvas-canvas").prop("style", "max-width: none");
    jQuery(".CanvasZone").prop("style", "max-width: none");

    return (
      <HashRouter>
        <Switch>
          <Route component={HomeScreen} path="/" exact />
          <Route component={SingleScreen} path="/:id" exact />
        </Switch>
      </HashRouter>
    );
  }
}

{
  /* <div className={ styles.container }>
<div className={ styles.row }>
  <div className={ styles.column }>
    <span className={ styles.title }>Welcome to SharePoint!</span>
    <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
    <p className={ styles.description }>{escape(this.props.description)}</p>
    <a href="https://aka.ms/spfx" className={ styles.button }>
      <span className={ styles.label }>Learn more</span>
    </a>
  </div>
</div>
</div> */
}
