/* eslint-disable max-len */
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { select, dagreD3 } from '../lib/common-js-modules.esm.js';

{
  const DEFAULT_OPTIONS = {
    rankdir: 'LR',
    align: 'DL',
    ranksep: 50,
    edgesep: 50,
    nodesep: 0
  };

  const START_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"></path>
    </svg>
  `;

  const POINT_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm80 248c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80z"></path>
    </svg>
  `;

  const END_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
    </svg>
  `;

  /**
   * `<form-progress-viewer>` Web Component for visualizing progress in a form.
   *
   * ```html
   * <form-progress-viewer></form-progress-viewer>
   * ```
   *
   * @mixes ThemableMixin
   * @demo demo/index.html
   */
  class FormProgressViewer extends ThemableMixin(PolymerElement) {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }

          /* NODE STYLES */

          .node {
            white-space: nowrap;
          }

          .node rect {
            fill: transparent;
          }

          .node text {
            font-size: 10px;
          }

          .node-content {
            display: flex;
            width: 100%;
            height: 100%;
          }

          .node-content svg {
            width: 30px;
            height: 30px;
            margin: auto;
          }

          .node-content .node-label {
            position: absolute;
            height: 50px;
          }

          /* EDGE STYLES */

          .edgePath path.path {
            stroke: #000;
            stroke-width: 6px;
            stroke-linecap: round;
          }
        </style>
        <div id="container" part="svg-container">
          <svg id="svg" part="svg">
            <g id="g" />
          </svg>
        </div>
      `;
    }

    static get is() {
      return 'form-progress-viewer';
    }

    static get version() {
      return '1.0.0';
    }

    static get properties() {
      return {
        data: Object
      };
    }

    static get observers() {
      return ['_dataChanged(data, data.*)'];
    }

    constructor() {
      super();
      this.graph = new dagreD3.graphlib.Graph().setGraph(DEFAULT_OPTIONS);
      this.options = this.graph.graph();
    }

    ready() {
      super.ready();
      this.svg = select(this.$.svg);
      this.graphElement = select(this.$.g);
    }

    render() {
      this.$.g.innerHTML = '';
      this.graphElement.call(dagreD3.render(), this.graph, {
        edgeLabelX: this.edgeLabelX,
        edgeLabelY: this.edgeLabelY
      });
      const graphBBox = this.graphElement.node().getBBox();
      this.svg.attr('viewBox', `0 0 ${graphBBox.width} ${graphBBox.height}`);
      this._styleGraph();
      this._addLabels();
    }

    _addLabels() {
      this.graph.nodes().forEach(node => {
        const nodeData = this.graph.node(node);
        const nodeElement = select(nodeData.elem);
        const text = nodeElement.insert('text').text(nodeData.rawLabel);
        const textBBox = text.node().getBBox();
        const nodeBBox = nodeElement
          .select('rect')
          .node()
          .getBBox();
        const centerCoords = (w1, w2) => (w1 - w2) * 0.5;
        text
          .attr('x', nodeBBox.x + centerCoords(nodeBBox.width, textBBox.width))
          .attr('y', nodeBBox.y + nodeBBox.height - 8);
      });
    }

    _styleGraph() {
      this.graphElement
        .selectAll('.edgePath marker')
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('refX', '-1.5');
      this.graphElement
        .selectAll('.node foreignObject > div')
        .style('width', '100%')
        .style('height', '100%');
    }

    _styleNodes(nodes) {
      nodes.forEach(node => {
        if (!node.styled) {
          node.labelType = 'html';
          node.rawLabel = node.label && node.label.trim();
          node.label = `
            <div class="node-content">
              ${node.id === 'start' ? START_ICON : String(node.id).indexOf('end') === 0 ? END_ICON : POINT_ICON}
            </div>
          `;
          node.styled = true;
        }
      });
      return nodes;
    }

    _getNodeIcon(node) {
      switch (node.type) {
        case 'start':
      }
    }

    /* OBSERVERS */

    _nodesChanged(nodes) {
      this._styleNodes(nodes);
      this._resetGraph();
      this.dispatchEvent(new CustomEvent('nodes-change', { detail: { nodes } }));
      this.render();
    }

    _edgesChanged(edges) {
      this._resetGraph();
      this.dispatchEvent(new CustomEvent('edges-change', { detail: { edges } }));
      this.render();
    }

    _dataChanged(data) {
      if (data.nodes && data.edges) {
        this._addStartNode();
        this._addEndNode();
        this._nodesChanged(data.nodes);
        this._edgesChanged(data.edges);
      }
    }

    _addStartNode() {
      const startNode = this.data.nodes.filter(node => node.type === 'start')[0];
      if (startNode) {
        this.data.nodes.push({ id: 'start' });
        this.data.edges.push({ from: 'start', to: startNode.id });
      }
    }

    _addEndNode() {
      const endNodes = this.data.nodes.filter(node => node.type === 'end');
      if (endNodes.length) {
        this.data.nodes.push({ id: 'end' });
        endNodes.forEach(node => this.data.edges.push({ from: node.id, to: 'end' }));
      }
    }

    _resetGraph() {
      this.graph = new dagreD3.graphlib.Graph().setGraph(this.options);
      if (this.data.nodes && this.data.nodes.length) {
        this.data.nodes.forEach(node => {
          node.id = String(node.id);
          this.graph.setNode(node.id, node);
        });
      }
      if (this.data.edges && this.data.edges.length) {
        this.data.edges.forEach(edge => {
          edge.from = String(edge.from);
          edge.to = String(edge.to);
          this.graph.setEdge(edge.from, edge.to, edge);
        });
      }
    }
  }

  customElements.define(FormProgressViewer.is, FormProgressViewer);
}
