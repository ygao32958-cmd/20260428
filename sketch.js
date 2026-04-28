// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480); // 設定攝影機擷取解析度
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#e7c6ff');

  // 計算顯示影像的寬高與起始座標 (置中且為畫布 50%)
  let displayW = width * 0.5;
  let displayH = height * 0.5;
  let startX = (width - displayW) / 2;
  let startY = (height - displayH) / 2;

  image(video, startX, startY, displayW, displayH);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 將原始影像座標映射到置中縮放後的畫面座標
          let mappedX = map(keypoint.x, 0, video.width, startX, startX + displayW);
          let mappedY = map(keypoint.y, 0, video.height, startY, startY + displayH);

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(mappedX, mappedY, 16);
        }
      }
    }
  }
}
