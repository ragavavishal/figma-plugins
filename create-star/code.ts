// This plugin will open a window to prompt the user to enter the number of stars to be created and the no. of filled stars.
// it will then create that many stars on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {width: 320, height: 640, title: "Color tint generator"});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'actionGenerate') {
    console.log(msg.formData)
    //Destrcuture formData
    const {
      colorCode,
      totalStars,
      coloredStars,
      starSpacing,
  } = msg.formData;

  //create a frame and name it
  const parentFrame = figma.createFrame();
  parentFrame.name = `${coloredStars}/${totalStars} with color ${colorCode}`;

  //Add auto layout to the frame and set direction , padding, spacing, and the sizing mode.

  parentFrame.layoutMode = "HORIZONTAL";
  parentFrame.paddingLeft = 64
  parentFrame.paddingRight = 64
  parentFrame.paddingTop = 64
  parentFrame.paddingBottom = 64

  parentFrame.itemSpacing = parseInt(starSpacing);

  parentFrame.primaryAxisSizingMode = "AUTO"
  parentFrame.counterAxisSizingMode = "AUTO"

  function hexToRgb(hex:any) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  for (let i=0; i< totalStars; i++){
    const starNode = figma.createStar();
    let fill = false;
    if (i <= (coloredStars-1)) fill = true;

    //Name the layer
    starNode.name = fill ? `Star-Filled-${colorCode}-${i+1}` : `Star-UnFilled-${i+1}`

    //Size the layer
    starNode.resize(100, 100);

    const colorR = hexToRgb(colorCode)?.r || 0;
    const colorG = hexToRgb(colorCode)?.g || 0;
    const colorB = hexToRgb(colorCode)?.b || 0;
    console.log(colorR, colorG,colorB)
    
    if (fill){
      starNode.fills = [{
        type: "SOLID",
        color: {r: colorR/255 ,g: colorG/255,b: colorB/255}
      }]
    }
    
    // Add generated nodes to parent frame
    parentFrame.appendChild(starNode)

    // Select and zoom the generated frame
    const selectedFrame : FrameNode[] = []
    selectedFrame.push(parentFrame);

    figma.currentPage.selection = selectedFrame
    figma.viewport.scrollAndZoomIntoView(selectedFrame)
  }

    figma.closePlugin("Stars generated successfully");

   
  } else if (msg.type === "actionExit"){
    figma.closePlugin();
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
};