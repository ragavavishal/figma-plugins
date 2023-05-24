// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 400,
  height: 500,
  title: "Color Tint generator",
});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "generate-tints") {
    console.log("code.ts", msg.formData);

    const { colorCode, colorName, numberOfTints, circleSpacing, circleSize } =
      msg.formData;

    let frame = figma.createFrame();

    frame.paddingLeft = 64;
    frame.paddingRight = 64;
    frame.paddingTop = 64;
    frame.paddingBottom = 64;
    frame.layoutMode = "HORIZONTAL";

    frame.itemSpacing = parseInt(circleSpacing);

    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";

    frame.name = `Tint for ${colorName}-${colorCode}-${numberOfTints}`;

    function hexToRgb(hex: any) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    }

    for (let i = 0; i < numberOfTints; i++) {
      let node = figma.createEllipse();
      node.name = `${colorCode} - ${100-i*10}`
      node.resize(parseInt(circleSize), parseInt(circleSize));
      let colorR = hexToRgb(colorCode)?.r || 0;
      let colorG = hexToRgb(colorCode)?.g || 0;
      let colorB = hexToRgb(colorCode)?.b || 0;

      node.fills = [
        { type: "SOLID", color: { r: colorR/255, g: colorG/255, b: colorB/255 } },
      ];
      node.opacity = (100-i*10)/100;

      frame.appendChild(node);
    }
    figma.currentPage.selection = [frame];

    figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);

    // figma.currentPage.selection = [frame];

    // const nodes: SceneNode[] = [];
    // for (let i = 0; i < msg.count; i++) {
    //   const rect = figma.createRectangle();
    //   rect.x = i * 150;
    //   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
    //   figma.currentPage.appendChild(rect);
    //   nodes.push(rect);
    // }
    // figma.currentPage.selection = nodes;
    // figma.viewport.scrollAndZoomIntoView(nodes);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};
