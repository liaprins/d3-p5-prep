var a = ["SMURF1",0.85,0.60,0.60,0.55,0.55,0.55,0.55,0.50,0.45,0.30,0.30,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.20,0.15,0.15,0.15,0.10,0.05,0.05];
var b = ["BUB1",0.50,0.50,0.50,0.50,0.50,0.50,0.45,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var c = ["ICK", 0.95, 0.85, 0.70,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var d = ["WEE1",0.95,0.30,0.30,0.30,0.30,0.30,0.25,0.25,0.25,0.25,0.25,0.20,0.20,0.20,0.20,0,0,0,0,0,0,0,0,0,0];
var e = ["ZZZ3",0.45,0.45,0.45,0.25,0.25,0.25,0.20,0.20,0.20,0.15,0.10,0.10,0.05,0.05,0,0,0,0,0,0,0,0,0,0,0];
var f = ["TRRAP",0.50,0.35,0.35,0.25,0.25,0.25,0.20,0.20,0.20,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15];

var slider;
function setup() {
	createCanvas(windowWidth, windowHeight + 200);

	slider = createSlider(0, 280, 80, 20);
	slider.position(100+10, 398 + 95);
	slider.style('width', '295px');

	sliderSim = createSlider(0, 200, 100, 20);
	sliderSim.position(-13, 398 - 10);
	sliderSim.style('width', '213px');
}

function draw() {
	background(255);

	var val = slider.value();
	var valSim = sliderSim.value();

	for (i = 0; i < 15; i++) {
		strokeWeight(0);
		fill(243);
		rect((i * 20) + 100, 398 - 100, 18, 200);
	}


	for (i = 0; i < val/20 + 1; i++) {
		strokeWeight(0);
		fill(185, 235, 244);
		rect((i * 20) + 100, 398 - 100, 18, 200);
		fill(113, 205, 221);
		rect((i * 20) + 100, 398 - 100, 18, (200-valSim));
	}

	fill(0);
	textSize(18);
	text("Minimum chemical similarity: " + valSim/200, 100, 100);
	text("Maximum compound count: " + int(val/20 + 1), 100, 150);

	// SMURF1
	var sumA = 0;
	for (i = 1; i < int(val/20 + 2); i++) {
		if (a[i] >= valSim/200) {
			sumA += a[i];
		}
	}

	// BUB1
	var sumB = 0;
	for (i = 1; i < int(val/20 + 2); i++) {
		if (b[i] >= valSim/200) {
			sumB += b[i];
		}
	}

	// ICK
	var sumC = 0;
	for (i = 1; i < int(val/20 + 2); i++) {
		if (c[i] >= valSim/200) {
			sumC += c[i];
		}
	}

	// WEE1
	var sumD = 0;
	for (i = 1; i < int(val/20 + 2); i++) {
		if (d[i] >= valSim/200) {
			sumD += d[i];
		}
	}

	// ZZZ3
	var sumE = 0;
	for (i = 1; i < int(val/20 + 2); i++) {
		if (e[i] >= valSim/200) {
			sumE += e[i];
		}
	}

	// TRRAP
	var sumF = 0;
	for (i = 1; i < int(val/20 + 2); i++) {
		if (f[i] >= valSim/200) {
			sumF += f[i];
		}
	}

	var aAll = [sumA,"SMURF1",0.85,0.60,0.60,0.55,0.55,0.55,0.55,0.50,0.45,0.30,0.30,0.25,0.25,0.25,0.25,0.25,0.25,0.25,0.20,0.15,0.15,0.15,0.10,0.05,0.05];
	var bAll = [sumB,"BUB1",0.50,0.50,0.50,0.50,0.50,0.50,0.45,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var cAll = [sumC,"ICK",0.95,0.85,0.70,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var dAll = [sumD,"WEE1",0.95,0.30,0.30,0.30,0.30,0.30,0.25,0.25,0.25,0.25,0.25,0.20,0.20,0.20,0.20,0,0,0,0,0,0,0,0,0,0];
	var eAll = [sumE,"ZZZ3",0.45,0.45,0.45,0.25,0.25,0.25,0.20,0.20,0.20,0.15,0.10,0.10,0.05,0.05,0,0,0,0,0,0,0,0,0,0,0];
	var fAll = [sumF,"TRRAP",0.50,0.35,0.35,0.25,0.25,0.25,0.20,0.20,0.20,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15,0.15];

	var all = [aAll, bAll, cAll, dAll, eAll, fAll];

	all.sort();

	for (j = 0; j < all.length; j++) {

		if (all[j][0] > 0) {

			textSize(22);
			text(all[j][1], 500, 175*(all.length-j-1)+100);
			textSize(18);
			text("Aggregate score: " + (round(all[j][0] * 100)/100) + " / " + int(val/20 + 1) + " = " + (round(all[j][0]/(int(val/20 + 1)) * 100)/100), 500, 175*(all.length-j-1)+135);
			for (i = 2; i < int(val/20 + 3); i++) {
				fill(255);
				strokeWeight(2);
				stroke(243);
				rect(500 + 60*i-120, 175*(all.length-j-1)+155, 50, 50);
				strokeWeight(0);
				fill(243);
				rect(720 + 8.5*i-113, 175*(all.length-j-1)+71, 7, 30);
				fill(0);
				if (all[j][i] >= valSim/200) {
					fill(0);
					strokeWeight(0);
					textSize(12);
					text(all[j][i], 500 + 60*i-101, 175*(all.length-j-1)+185);
					textSize(18);
					fill(243);
					rect(500 + 60*i-113, 175*(all.length-j-1)+165, 7, 30);
					fill(113, 205, 221);
					rect(500 + 60*i-113, 175*(all.length-j-1)+165 + ((1-all[j][i])*30), 7, all[j][i]*30);
					rect(720 + 8.5*i-113, 175*(all.length-j-1)+71 + ((1-all[j][i])*30), 7, all[j][i]*30);
					fill(185, 235, 244);
					rect(500 + 60*i-113, 175*(all.length-j-1)+165+30-(30*(valSim/200)), 7, (30*(valSim/200)));
					rect(720 + 8.5*i-113, 175*(all.length-j-1)+71+30-(30*(valSim/200)), 7, (30*(valSim/200)));
					fill(0);
				}
			}

		}

	}

}
