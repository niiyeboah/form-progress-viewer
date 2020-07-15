import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { ElementMixin } from '@vaadin/vaadin-element-mixin';

/**
 * `<form-progress-viewer>` Web Component for visualizing progress in a form.
 *
 * ```html
 * <form-progress-viewer></form-progress-viewer>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--form-progress-viewer-property` | Example custom property | `unset`
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `part` | Example part
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `attribute` | Example styling attribute | :host
 *
 * @memberof Vaadin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @demo demo/index.html
 */
class FormProgressViewer extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <slot>form-progress-viewer</slot>
    `;
  }

  static get is() {
    return 'form-progress-viewer';
  }

  static get version() {
    return '1.1.0';
  }

  static get properties() {
    return {};
  }
}

customElements.define(FormProgressViewer.is, FormProgressViewer);

/**
 * @namespace Vaadin
 */
window.Vaadin.FormProgressViewer = FormProgressViewer;
