import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp/presets/all";

import * as strings from 'DmsWebPartStrings';
import Dms from './components/Dms';
import { IDmsProps } from './components/IDmsProps';


export interface IDmsWebPartProps {
  description: string;
}

export default class DmsWebPart extends BaseClientSideWebPart<IDmsWebPartProps> {
  public onInit(): Promise<void> {
    // pnpSetup({
    //   spfxContext: this.context
    // });
    sp.setup({
      spfxContext: this.context,
    });
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IDmsProps> = React.createElement(
      Dms,
      {
        description: this.properties.description,
        context: this.context,
        pageContext: this.context.pageContext,
        siteUrl: this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
