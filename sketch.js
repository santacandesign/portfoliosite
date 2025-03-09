let font;
let points = [];
let r = 9;
let angle = 0.4;
let circles = [];
let numCircles = 60;
let circleRadius = 4;

function preload() {
  font = loadFont("assets/font.ttf");
  jostfont = loadFont(
    "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7myjJQVG.ttf"
  );
  chaosArrow = loadImage("assets/chaosarrow.svg");
}

new p5((sketch) => {
  sketch.preload = function () {
    font = sketch.loadFont("assets/font.ttf");
    jostfont = sketch.loadFont(
      "https://fonts.gstatic.com/s/jost/v15/92zPtBhPNqw79Ij1E865zBUv7myjJQVG.ttf"
    );
    chaosArrow = sketch.loadImage("assets/chaosarrow.svg");
  };

  sketch.setup = function () {
    let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvas.parent("p5jsholder");
    sketch.imageMode(sketch.CENTER);
    sketch.clear(); // Make canvas transparent

    points = font.textToPoints(
      "Santrupti P",
      150,
      sketch.windowHeight / 3,
      sketch.windowWidth / 8,
      {
        sampleFactor: 0.5,
      }
    );

    sketch.angleMode(sketch.DEGREES);
  };

  sketch.draw = function () {
    r = (sketch.windowWidth - sketch.mouseX + 7) / 80;
    sketch.clear();

    sketch.fill(17, 17, 17);
    sketch.noStroke();
    sketch.textFont(font);
    sketch.textSize(22);
    sketch.text(" is mostly a product designer that sometimes codes", 490, 550);

    sketch.fill(255, 255, 255);
    sketch.stroke(255, 69, 69);
    sketch.strokeWeight(1);
    for (let i = 0; i < points.length; i++) {
      sketch.ellipse(
        points[i].x + 50 + r * sketch.sin(angle + i * 2),
        points[i].y + 220 + r * sketch.cos(angle + i * 2),
        14,
        14
      );
    }
    angle += 40;

    // Draw a vertical line at the cursor's Y position
    sketch.stroke(17, 17, 17);
    sketch.strokeWeight(2);
    sketch.line(sketch.mouseX, 0, sketch.mouseX, sketch.windowHeight);

    // Axis properties
    let axisY = 70;
    let arrowSize = 10;
    let axisPadding = 50;

    sketch.stroke(17, 17, 17);

    // Draw the axis line
    sketch.line(axisPadding, axisY, sketch.windowWidth - axisPadding, axisY);

    // Draw left arrowhead (Day side)
    sketch.fill(17, 17, 17);
    sketch.noStroke();
    sketch.triangle(
      axisPadding,
      axisY,
      axisPadding + arrowSize,
      axisY - arrowSize,
      axisPadding + arrowSize,
      axisY + arrowSize
    );

    // Draw right arrowhead (Night side)
    sketch.triangle(
      sketch.windowWidth - axisPadding,
      axisY,
      sketch.windowWidth - axisPadding - arrowSize,
      axisY - arrowSize,
      sketch.windowWidth - axisPadding - arrowSize,
      axisY + arrowSize
    );

    // Draw labels
    sketch.textSize(16);
    sketch.fill(17, 17, 17);
    sketch.noStroke();
    sketch.textAlign(sketch.CENTER, sketch.CENTER);

    sketch.text("Day", axisPadding + 20, axisY + 20);
    sketch.text("Night", sketch.windowWidth - axisPadding - 20, axisY + 20);

    sketch.image(chaosArrow, 460, 250, 66, 83);

    sketch.fill(17, 17, 17);
    sketch.noStroke();
    sketch.textFont(font);
    sketch.textSize(16);
    sketch.text(" moves at the rate of chaos", 300, 210);
    sketch.text("in her mind wrt time of day", 300, 230);
  };
});
