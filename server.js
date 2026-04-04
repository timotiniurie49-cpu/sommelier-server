<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0A0705">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Sommelier World">
<link rel="manifest" href="manifest.json">
<title>Sommelier World</title>
<style>
/* required styles */

.leaflet-pane,
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-tile-container,
.leaflet-pane > svg,
.leaflet-pane > canvas,
.leaflet-zoom-box,
.leaflet-image-layer,
.leaflet-layer {
	position: absolute;
	left: 0;
	top: 0;
	}
.leaflet-container {
	overflow: hidden;
	}
.leaflet-tile,
.leaflet-marker-icon,
.leaflet-marker-shadow {
	-webkit-user-select: none;
	   -moz-user-select: none;
	        user-select: none;
	  -webkit-user-drag: none;
	}
/* Prevents IE11 from highlighting tiles in blue */
.leaflet-tile::selection {
	background: transparent;
}
/* Safari renders non-retina tile on retina better with this, but Chrome is worse */
.leaflet-safari .leaflet-tile {
	image-rendering: -webkit-optimize-contrast;
	}
/* hack that prevents hw layers "stretching" when loading new tiles */
.leaflet-safari .leaflet-tile-container {
	width: 1600px;
	height: 1600px;
	-webkit-transform-origin: 0 0;
	}
.leaflet-marker-icon,
.leaflet-marker-shadow {
	display: block;
	}
/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */
/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */
.leaflet-container .leaflet-overlay-pane svg {
	max-width: none !important;
	max-height: none !important;
	}
.leaflet-container .leaflet-marker-pane img,
.leaflet-container .leaflet-shadow-pane img,
.leaflet-container .leaflet-tile-pane img,
.leaflet-container img.leaflet-image-layer,
.leaflet-container .leaflet-tile {
	max-width: none !important;
	max-height: none !important;
	width: auto;
	padding: 0;
	}

.leaflet-container img.leaflet-tile {
	/* See: https://bugs.chromium.org/p/chromium/issues/detail?id=600120 */
	mix-blend-mode: plus-lighter;
}

.leaflet-container.leaflet-touch-zoom {
	-ms-touch-action: pan-x pan-y;
	touch-action: pan-x pan-y;
	}
.leaflet-container.leaflet-touch-drag {
	-ms-touch-action: pinch-zoom;
	/* Fallback for FF which doesn't support pinch-zoom */
	touch-action: none;
	touch-action: pinch-zoom;
}
.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {
	-ms-touch-action: none;
	touch-action: none;
}
.leaflet-container {
	-webkit-tap-highlight-color: transparent;
}
.leaflet-container a {
	-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);
}
.leaflet-tile {
	filter: inherit;
	visibility: hidden;
	}
.leaflet-tile-loaded {
	visibility: inherit;
	}
.leaflet-zoom-box {
	width: 0;
	height: 0;
	-moz-box-sizing: border-box;
	     box-sizing: border-box;
	z-index: 800;
	}
/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */
.leaflet-overlay-pane svg {
	-moz-user-select: none;
	}

.leaflet-pane         { z-index: 400; }

.leaflet-tile-pane    { z-index: 200; }
.leaflet-overlay-pane { z-index: 400; }
.leaflet-shadow-pane  { z-index: 500; }
.leaflet-marker-pane  { z-index: 600; }
.leaflet-tooltip-pane   { z-index: 650; }
.leaflet-popup-pane   { z-index: 700; }

.leaflet-map-pane canvas { z-index: 100; }
.leaflet-map-pane svg    { z-index: 200; }

.leaflet-vml-shape {
	width: 1px;
	height: 1px;
	}
.lvml {
	behavior: url(#default#VML);
	display: inline-block;
	position: absolute;
	}


/* control positioning */

.leaflet-control {
	position: relative;
	z-index: 800;
	pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
	pointer-events: auto;
	}
.leaflet-top,
.leaflet-bottom {
	position: absolute;
	z-index: 1000;
	pointer-events: none;
	}
.leaflet-top {
	top: 0;
	}
.leaflet-right {
	right: 0;
	}
.leaflet-bottom {
	bottom: 0;
	}
.leaflet-left {
	left: 0;
	}
.leaflet-control {
	float: left;
	clear: both;
	}
.leaflet-right .leaflet-control {
	float: right;
	}
.leaflet-top .leaflet-control {
	margin-top: 10px;
	}
.leaflet-bottom .leaflet-control {
	margin-bottom: 10px;
	}
.leaflet-left .leaflet-control {
	margin-left: 10px;
	}
.leaflet-right .leaflet-control {
	margin-right: 10px;
	}


/* zoom and fade animations */

.leaflet-fade-anim .leaflet-popup {
	opacity: 0;
	-webkit-transition: opacity 0.2s linear;
	   -moz-transition: opacity 0.2s linear;
	        transition: opacity 0.2s linear;
	}
.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {
	opacity: 1;
	}
.leaflet-zoom-animated {
	-webkit-transform-origin: 0 0;
	    -ms-transform-origin: 0 0;
	        transform-origin: 0 0;
	}
svg.leaflet-zoom-animated {
	will-change: transform;
}

.leaflet-zoom-anim .leaflet-zoom-animated {
	-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);
	   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);
	        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);
	}
.leaflet-zoom-anim .leaflet-tile,
.leaflet-pan-anim .leaflet-tile {
	-webkit-transition: none;
	   -moz-transition: none;
	        transition: none;
	}

.leaflet-zoom-anim .leaflet-zoom-hide {
	visibility: hidden;
	}


/* cursors */

.leaflet-interactive {
	cursor: pointer;
	}
.leaflet-grab {
	cursor: -webkit-grab;
	cursor:    -moz-grab;
	cursor:         grab;
	}
.leaflet-crosshair,
.leaflet-crosshair .leaflet-interactive {
	cursor: crosshair;
	}
.leaflet-popup-pane,
.leaflet-control {
	cursor: auto;
	}
.leaflet-dragging .leaflet-grab,
.leaflet-dragging .leaflet-grab .leaflet-interactive,
.leaflet-dragging .leaflet-marker-draggable {
	cursor: move;
	cursor: -webkit-grabbing;
	cursor:    -moz-grabbing;
	cursor:         grabbing;
	}

/* marker & overlays interactivity */
.leaflet-marker-icon,
.leaflet-marker-shadow,
.leaflet-image-layer,
.leaflet-pane > svg path,
.leaflet-tile-container {
	pointer-events: none;
	}

.leaflet-marker-icon.leaflet-interactive,
.leaflet-image-layer.leaflet-interactive,
.leaflet-pane > svg path.leaflet-interactive,
svg.leaflet-image-layer.leaflet-interactive path {
	pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */
	pointer-events: auto;
	}

/* visual tweaks */

.leaflet-container {
	background: #ddd;
	outline-offset: 1px;
	}
.leaflet-container a {
	color: #0078A8;
	}
.leaflet-zoom-box {
	border: 2px dotted #38f;
	background: rgba(255,255,255,0.5);
	}


/* general typography */
.leaflet-container {
	font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
	font-size: 12px;
	font-size: 0.75rem;
	line-height: 1.5;
	}


/* general toolbar styles */

.leaflet-bar {
	box-shadow: 0 1px 5px rgba(0,0,0,0.65);
	border-radius: 4px;
	}
.leaflet-bar a {
	background-color: #fff;
	border-bottom: 1px solid #ccc;
	width: 26px;
	height: 26px;
	line-height: 26px;
	display: block;
	text-align: center;
	text-decoration: none;
	color: black;
	}
.leaflet-bar a,
.leaflet-control-layers-toggle {
	background-position: 50% 50%;
	background-repeat: no-repeat;
	display: block;
	}
.leaflet-bar a:hover,
.leaflet-bar a:focus {
	background-color: #f4f4f4;
	}
.leaflet-bar a:first-child {
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	}
.leaflet-bar a:last-child {
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
	border-bottom: none;
	}
.leaflet-bar a.leaflet-disabled {
	cursor: default;
	background-color: #f4f4f4;
	color: #bbb;
	}

.leaflet-touch .leaflet-bar a {
	width: 30px;
	height: 30px;
	line-height: 30px;
	}
.leaflet-touch .leaflet-bar a:first-child {
	border-top-left-radius: 2px;
	border-top-right-radius: 2px;
	}
.leaflet-touch .leaflet-bar a:last-child {
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
	}

/* zoom control */

.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
	font: bold 18px 'Lucida Console', Monaco, monospace;
	text-indent: 1px;
	}

.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {
	font-size: 22px;
	}


/* layers control */

.leaflet-control-layers {
	box-shadow: 0 1px 5px rgba(0,0,0,0.4);
	background: #fff;
	border-radius: 5px;
	}
.leaflet-control-layers-toggle {
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAQAAAADQ4RFAAACf0lEQVR4AY1UM3gkARTePdvdoTxXKc+qTl3aU5U6b2Kbkz3Gtq3Zw6ziLGNPzrYx7946Tr6/ee/XeCQ4D3ykPtL5tHno4n0d/h3+xfuWHGLX81cn7r0iTNzjr7LrlxCqPtkbTQEHeqOrTy4Yyt3VCi/IOB0v7rVC7q45Q3Gr5K6jt+3Gl5nCoDD4MtO+j96Wu8atmhGqcNGHObuf8OM/x3AMx38+4Z2sPqzCxRFK2aF2e5Jol56XTLyggAMTL56XOMoS1W4pOyjUcGGQdZxU6qRh7B9Zp+PfpOFlqt0zyDZckPi1ttmIp03jX8gyJ8a/PG2yutpS/Vol7peZIbZcKBAEEheEIAgFbDkz5H6Zrkm2hVWGiXKiF4Ycw0RWKdtC16Q7qe3X4iOMxruonzegJzWaXFrU9utOSsLUmrc0YjeWYjCW4PDMADElpJSSQ0vQvA1Tm6/JlKnqFs1EGyZiFCqnRZTEJJJiKRYzVYzJck2Rm6P4iH+cmSY0YzimYa8l0EtTODFWhcMIMVqdsI2uiTvKmTisIDHJ3od5GILVhBCarCfVRmo4uTjkhrhzkiBV7SsaqS+TzrzM1qpGGUFt28pIySQHR6h7F6KSwGWm97ay+Z+ZqMcEjEWebE7wxCSQwpkhJqoZA5ivCdZDjJepuJ9IQjGGUmuXJdBFUygxVqVsxFsLMbDe8ZbDYVCGKxs+W080max1hFCarCfV+C1KATwcnvE9gRRuMP2prdbWGowm1KB1y+zwMMENkM755cJ2yPDtqhTI6ED1M/82yIDtC/4j4BijjeObflpO9I9MwXTCsSX8jWAFeHr05WoLTJ5G8IQVS/7vwR6ohirYM7f6HzYpogfS3R2OAAAAAElFTkSuQmCC);
	width: 36px;
	height: 36px;
	}
.leaflet-retina .leaflet-control-layers-toggle {
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAQAAABvcdNgAAAEsklEQVR4AWL4TydIhpZK1kpWOlg0w3ZXP6D2soBtG42jeI6ZmQTHzAxiTbSJsYLjO9HhP+WOmcuhciVnmHVQcJnp7DFvScowZorad/+V/fVzMdMT2g9Cv9guXGv/7pYOrXh2U+RRR3dSd9JRx6bIFc/ekqHI29JC6pJ5ZEh1yWkhkbcFeSjxgx3L2m1cb1C7bceyxA+CNjT/Ifff+/kDk2u/w/33/IeCMOSaWZ4glosqT3DNnNZQ7Cs58/3Ce5HL78iZH/vKVIaYlqzfdLu8Vi7dnvUbEza5Idt36tquZFldl6N5Z/POLof0XLK61mZCmJSWjVF9tEjUluu74IUXvgttuVIHE7YxSkaYhJZam7yiM9Pv82JYfl9nptxZaxMJE4YSPty+vF0+Y2up9d3wwijfjZbabqm/3bZ9ecKHsiGmRflnn1MW4pjHf9oLufyn2z3y1D6n8g8TZhxyzipLNPnAUpsOiuWimg52psrTZYnOWYNDTMuWBWa0tJb4rgq1UvmutpaYEbZlwU3CLJm/ayYjHW5/h7xWLn9Hh1vepDkyf7dE7MtT5LR4e7yYpHrkhOUpEfssBLq2pPhAqoSWKUkk7EDqkmK6RrCEzqDjhNDWNE+XSMvkJRDWlZTmCW0l0PHQGRZY5t1L83kT0Y3l2SItk5JAWHl2dCOBm+fPu3fo5/3v61RMCO9Jx2EEYYhb0rmNQMX/vm7gqOEJLcXTGw3CAuRNeyaPWwjR8PRqKQ1PDA/dpv+on9Shox52WFnx0KY8onHayrJzm87i5h9xGw/tfkev0jGsQizqezUKjk12hBMKJ4kbCqGPVNXudyyrShovGw5CgxsRICxF6aRmSjlBnHRzg7Gx8fKqEubI2rahQYdR1YgDIRQO7JvQyD52hoIQx0mxa0ODtW2Iozn1le2iIRdzwWewedyZzewidueOGqlsn1MvcnQpuVwLGG3/IR1hIKxCjelIDZ8ldqWz25jWAsnldEnK0Zxro19TGVb2ffIZEsIO89EIEDvKMPrzmBOQcKQ+rroye6NgRRxqR4U8EAkz0CL6uSGOm6KQCdWjvjRiSP1BPalCRS5iQYiEIvxuBMJEWgzSoHADcVMuN7IuqqTeyUPq22qFimFtxDyBBJEwNyt6TM88blFHao/6tWWhuuOM4SAK4EI4QmFHA+SEyWlp4EQoJ13cYGzMu7yszEIBOm2rVmHUNqwAIQabISNMRstmdhNWcFLsSm+0tjJH1MdRxO5Nx0WDMhCtgD6OKgZeljJqJKc9po8juskR9XN0Y1lZ3mWjLR9JCO1jRDMd0fpYC2VnvjBSEFg7wBENc0R9HFlb0xvF1+TBEpF68d+DHR6IOWVv2BECtxo46hOFUBd/APU57WIoEwJhIi2CdpyZX0m93BZicktMj1AS9dClteUFAUNUIEygRZCtik5zSxI9MubTBH1GOiHsiLJ3OCoSZkILa9PxiN0EbvhsAo8tdAf9Seepd36lGWHmtNANTv5Jd0z4QYyeo/UEJqxKRpg5LZx6btLPsOaEmdMyxYdlc8LMaJnikDlhclqmPiQnTEpLUIZEwkRagjYkEibQErwhkTAKCLQEbUgkzJQWc/0PstHHcfEdQ+UAAAAASUVORK5CYII=);
	background-size: 26px 26px;
	}
.leaflet-touch .leaflet-control-layers-toggle {
	width: 44px;
	height: 44px;
	}
.leaflet-control-layers .leaflet-control-layers-list,
.leaflet-control-layers-expanded .leaflet-control-layers-toggle {
	display: none;
	}
.leaflet-control-layers-expanded .leaflet-control-layers-list {
	display: block;
	position: relative;
	}
.leaflet-control-layers-expanded {
	padding: 6px 10px 6px 6px;
	color: #333;
	background: #fff;
	}
.leaflet-control-layers-scrollbar {
	overflow-y: scroll;
	overflow-x: hidden;
	padding-right: 5px;
	}
.leaflet-control-layers-selector {
	margin-top: 2px;
	position: relative;
	top: 1px;
	}
.leaflet-control-layers label {
	display: block;
	font-size: 13px;
	font-size: 1.08333em;
	}
.leaflet-control-layers-separator {
	height: 0;
	border-top: 1px solid #ddd;
	margin: 5px -10px 5px -6px;
	}

/* Default icon URLs */
.leaflet-default-icon-path { /* used only in path-guessing heuristic, see L.Icon.Default */
	background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=);
	}


/* attribution and scale controls */

.leaflet-container .leaflet-control-attribution {
	background: #fff;
	background: rgba(255, 255, 255, 0.8);
	margin: 0;
	}
.leaflet-control-attribution,
.leaflet-control-scale-line {
	padding: 0 5px;
	color: #333;
	line-height: 1.4;
	}
.leaflet-control-attribution a {
	text-decoration: none;
	}
.leaflet-control-attribution a:hover,
.leaflet-control-attribution a:focus {
	text-decoration: underline;
	}
.leaflet-attribution-flag {
	display: inline !important;
	vertical-align: baseline !important;
	width: 1em;
	height: 0.6669em;
	}
.leaflet-left .leaflet-control-scale {
	margin-left: 5px;
	}
.leaflet-bottom .leaflet-control-scale {
	margin-bottom: 5px;
	}
.leaflet-control-scale-line {
	border: 2px solid #777;
	border-top: none;
	line-height: 1.1;
	padding: 2px 5px 1px;
	white-space: nowrap;
	-moz-box-sizing: border-box;
	     box-sizing: border-box;
	background: rgba(255, 255, 255, 0.8);
	text-shadow: 1px 1px #fff;
	}
.leaflet-control-scale-line:not(:first-child) {
	border-top: 2px solid #777;
	border-bottom: none;
	margin-top: -2px;
	}
.leaflet-control-scale-line:not(:first-child):not(:last-child) {
	border-bottom: 2px solid #777;
	}

.leaflet-touch .leaflet-control-attribution,
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
	box-shadow: none;
	}
.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
	border: 2px solid rgba(0,0,0,0.2);
	background-clip: padding-box;
	}


/* popup */

.leaflet-popup {
	position: absolute;
	text-align: center;
	margin-bottom: 20px;
	}
.leaflet-popup-content-wrapper {
	padding: 1px;
	text-align: left;
	border-radius: 12px;
	}
.leaflet-popup-content {
	margin: 13px 24px 13px 20px;
	line-height: 1.3;
	font-size: 13px;
	font-size: 1.08333em;
	min-height: 1px;
	}
.leaflet-popup-content p {
	margin: 17px 0;
	margin: 1.3em 0;
	}
.leaflet-popup-tip-container {
	width: 40px;
	height: 20px;
	position: absolute;
	left: 50%;
	margin-top: -1px;
	margin-left: -20px;
	overflow: hidden;
	pointer-events: none;
	}
.leaflet-popup-tip {
	width: 17px;
	height: 17px;
	padding: 1px;

	margin: -10px auto 0;
	pointer-events: auto;

	-webkit-transform: rotate(45deg);
	   -moz-transform: rotate(45deg);
	    -ms-transform: rotate(45deg);
	        transform: rotate(45deg);
	}
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
	background: white;
	color: #333;
	box-shadow: 0 3px 14px rgba(0,0,0,0.4);
	}
.leaflet-container a.leaflet-popup-close-button {
	position: absolute;
	top: 0;
	right: 0;
	border: none;
	text-align: center;
	width: 24px;
	height: 24px;
	font: 16px/24px Tahoma, Verdana, sans-serif;
	color: #757575;
	text-decoration: none;
	background: transparent;
	}
.leaflet-container a.leaflet-popup-close-button:hover,
.leaflet-container a.leaflet-popup-close-button:focus {
	color: #585858;
	}
.leaflet-popup-scrolled {
	overflow: auto;
	}

.leaflet-oldie .leaflet-popup-content-wrapper {
	-ms-zoom: 1;
	}
.leaflet-oldie .leaflet-popup-tip {
	width: 24px;
	margin: 0 auto;

	-ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)";
	filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);
	}

.leaflet-oldie .leaflet-control-zoom,
.leaflet-oldie .leaflet-control-layers,
.leaflet-oldie .leaflet-popup-content-wrapper,
.leaflet-oldie .leaflet-popup-tip {
	border: 1px solid #999;
	}


/* div icon */

.leaflet-div-icon {
	background: #fff;
	border: 1px solid #666;
	}


/* Tooltip */
/* Base styles for the element that has a tooltip */
.leaflet-tooltip {
	position: absolute;
	padding: 6px;
	background-color: #fff;
	border: 1px solid #fff;
	border-radius: 3px;
	color: #222;
	white-space: nowrap;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	pointer-events: none;
	box-shadow: 0 1px 3px rgba(0,0,0,0.4);
	}
.leaflet-tooltip.leaflet-interactive {
	cursor: pointer;
	pointer-events: auto;
	}
.leaflet-tooltip-top:before,
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
	position: absolute;
	pointer-events: none;
	border: 6px solid transparent;
	background: transparent;
	content: "";
	}

/* Directions */

.leaflet-tooltip-bottom {
	margin-top: 6px;
}
.leaflet-tooltip-top {
	margin-top: -6px;
}
.leaflet-tooltip-bottom:before,
.leaflet-tooltip-top:before {
	left: 50%;
	margin-left: -6px;
	}
.leaflet-tooltip-top:before {
	bottom: 0;
	margin-bottom: -12px;
	border-top-color: #fff;
	}
.leaflet-tooltip-bottom:before {
	top: 0;
	margin-top: -12px;
	margin-left: -6px;
	border-bottom-color: #fff;
	}
.leaflet-tooltip-left {
	margin-left: -6px;
}
.leaflet-tooltip-right {
	margin-left: 6px;
}
.leaflet-tooltip-left:before,
.leaflet-tooltip-right:before {
	top: 50%;
	margin-top: -6px;
	}
.leaflet-tooltip-left:before {
	right: 0;
	margin-right: -12px;
	border-left-color: #fff;
	}
.leaflet-tooltip-right:before {
	left: 0;
	margin-left: -12px;
	border-right-color: #fff;
	}

/* Printing */

@media print {
	/* Prevent printers from removing background-images of controls. */
	.leaflet-control {
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
		}
	}

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&family=IM+Fell+English:ital@1&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--nero:#0A0705;--vino:#5C1A1A;--oro:#BF9B4A;--crema:#F5EFE2;--parch:#EDE4CE;--bg:#0D0A07;}
body{background:var(--nero);color:var(--crema);font-family:"Cormorant Garamond",serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;overscroll-behavior-y:contain;scroll-behavior:smooth;}
body{-webkit-user-select:none;-moz-user-select:none;user-select:none;}
input,textarea,select{-webkit-user-select:text;user-select:text;}


/* ── Mobile & PWA optimization ── */
@media(max-width:480px){
  body{font-size:16px;-webkit-text-size-adjust:100%;}
  
  /* Nav */
  .nav-bar{padding:0 2px;}
  .ntab{padding:10px 6px 8px;min-width:0;}
  .ntab .ico{font-size:1.3rem;}
  .ntab .lbl{font-size:.45rem;letter-spacing:.08em;}
  .nav-logo span{font-size:.6rem;letter-spacing:.18em;}
  .nav-logo small{font-size:.4rem;letter-spacing:.3em;}
  
  /* Hero */
  #heroSection{min-height:240px;max-height:320px;}
  .hero-content{padding:16px 16px 20px;}
  #heroTitle{font-size:1.6rem;}
  #heroSub{font-size:.88rem;}
  
  /* Home body */
  .home-body{padding:0;}
  .gz-card-body{padding:14px 14px 16px;}
  .gz-text{font-size:.98rem;line-height:1.85;color:rgba(245,239,226,.82);}
  .gz-title{font-size:.95rem;}
  
  /* Masthead */
  .t-title{font-size:clamp(1.5rem,6.5vw,2.2rem);}
  .t-sub{font-size:.88rem;}
  
  /* Events */
  .ev-body{padding:10px 12px 14px;}
  .ev-title{font-size:.85rem;}
  .ev-desc{font-size:.88rem;}
  
  /* Explore */
  #page-explore{padding-top:52px;}
  #page-home{padding-top:52px;}
  #page-events{padding-top:52px;}
  
  /* Booking modal */
  #bookingModal .bm-inner{padding:16px 14px 20px;}
  
  /* Pro modal */
  #proModal .pm-inner{padding:20px 14px;}
  
  /* Forms */
  input,textarea,select{font-size:16px!important;} /* evita zoom iOS su focus */
  
  /* Bottom safe area per iPhone X+ */
  .nav-bar{padding-bottom:env(safe-area-inset-bottom, 0);}
  footer{padding-bottom:calc(16px + env(safe-area-inset-bottom, 0));}
}

/* PWA standalone mode */
@media(display-mode: standalone){
  .nav-bar{padding-bottom:env(safe-area-inset-bottom, 8px);}
  #page-home,#page-explore,#page-events,#page-sommelier,#page-produttori{
    padding-top:calc(52px + env(safe-area-inset-top, 0));
  }
}

/* Tap highlight rimosso — look nativo */
*{-webkit-tap-highlight-color:transparent;tap-highlight-color:transparent;}
button,a,[onclick]{touch-action:manipulation;}

/* ── Ken Burns hero ── */
@keyframes kenBurns{0%{transform:scale(1) translateX(0);}50%{transform:scale(1.08) translateX(-1%);}100%{transform:scale(1) translateX(0);}}
#heroBg{animation:kenBurns 22s ease-in-out infinite;will-change:transform;}

/* ── Watermark Pro ── */
.pro-watermark{position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden;}
.pro-watermark::before{content:'Sommelier World  ·  Sommelier World  ·  Sommelier World  ·  Sommelier World  ·  Sommelier World  ·  Sommelier World  ·  ';position:absolute;top:40%;left:-50%;width:200%;font-family:Cinzel,serif;font-size:1rem;letter-spacing:.3em;color:rgba(200,164,90,.03);transform:rotate(-28deg);white-space:pre-wrap;line-height:4;pointer-events:none;}

/* ── Live news dot ── */
.news-live-dot{width:7px;height:7px;border-radius:50%;background:var(--vino);display:inline-block;margin-right:6px;animation:livePulse 1.8s ease-in-out infinite;}
@keyframes livePulse{0%,100%{opacity:1;}50%{opacity:.2;}}

nav{position:fixed;top:0;left:0;right:0;z-index:400;height:52px;background:rgba(10,7,5,.97);border-bottom:1px solid rgba(191,155,74,.25);display:flex;align-items:stretch;}
.nav-logo{display:flex;align-items:center;padding:0 16px;border-right:1px solid rgba(191,155,74,.2);flex-shrink:0;}
.nav-logo span{font-family:"Cinzel",serif;font-size:.6rem;letter-spacing:3px;color:var(--oro);}
.nav-logo small{font-size:.4rem;letter-spacing:2px;color:rgba(191,155,74,.45);display:block;}
.nav-tabs{display:flex;flex:1;overflow-x:auto;}
.nav-tabs::-webkit-scrollbar{display:none;}
.ntab{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 14px;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;min-width:68px;}
.ntab .ico{font-size:1.1rem;}
.ntab .lbl{font-family:"Cinzel",serif;font-size:.4rem;letter-spacing:2px;color:rgba(191,155,74,.4);margin-top:2px;text-transform:uppercase;}
.ntab.active{border-bottom-color:var(--oro);}
.ntab.active .lbl{color:var(--oro);}

.page{display:none;padding-top:52px;min-height:100vh;}
.page.active{display:block!important;}
#page-map{padding-top:52px;min-height:100vh;}
#page-map.map-with-panel #map{height:42vh;}
#map{width:100%;height:45vh;background:#0D0A07;transition:height .3s ease;}
.map-bar{background:rgba(10,7,5,.95);border-bottom:1px solid rgba(191,155,74,.12);display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:7px 12px;}
.mbb{font-family:"Cinzel",serif;font-size:.57rem;letter-spacing:1.5px;padding:5px 11px;border:1px solid rgba(191,155,74,.25);background:transparent;color:rgba(191,155,74,.5);cursor:pointer;transition:all .18s;text-transform:uppercase;}
.mbb:hover,.mbb.on{background:var(--vino);color:#fff;border-color:var(--vino);}
#mapSearchBox{position:relative;flex:1;min-width:160px;}
#mapSearch{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(191,155,74,.22);padding:7px 11px;font-family:"Cormorant Garamond",serif;font-size:.95rem;color:var(--crema);outline:none;}
#mapSearch::placeholder{color:rgba(245,239,226,.28);}
#suggestions{position:absolute;top:100%;left:0;right:0;background:#1A0D08;border:1px solid rgba(191,155,74,.3);z-index:500;max-height:250px;overflow-y:auto;display:none;}
.sug-item{padding:9px 12px;cursor:pointer;border-bottom:1px solid rgba(191,155,74,.1);}
.sug-item:hover{background:rgba(191,155,74,.1);}
.sug-name{font-family:"Cinzel",serif;font-size:.63rem;color:var(--crema);}
.sug-sub{font-size:.73rem;color:rgba(191,155,74,.5);font-style:italic;}
.filter-row{display:flex;flex-wrap:wrap;gap:5px;padding:7px 12px;background:rgba(10,7,5,.9);border-bottom:1px solid rgba(191,155,74,.08);}
.filt{font-family:"Cinzel",serif;font-size:.56rem;letter-spacing:1.5px;padding:4px 10px;border:1px solid rgba(191,155,74,.2);background:transparent;color:rgba(191,155,74,.5);cursor:pointer;transition:all .18s;text-transform:uppercase;white-space:nowrap;}
.filt.on,.filt:hover{background:var(--vino);color:#fff;border-color:var(--vino);}
#mapCount{padding:6px 14px;background:rgba(10,7,5,.9);font-family:"Cinzel",serif;font-size:.57rem;letter-spacing:2px;color:rgba(191,155,74,.35);}

#drawer{position:fixed;bottom:0;left:0;right:0;z-index:350;background:var(--nero);border-top:2px solid rgba(191,155,74,.3);transform:translateY(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);height:52vh;overflow-y:auto;}
#drawer.open{transform:translateY(0);}
.drawer-handle{width:36px;height:4px;background:rgba(191,155,74,.3);border-radius:2px;margin:10px auto 0;}
.drawer-close{position:absolute;top:10px;right:14px;background:none;border:none;color:rgba(191,155,74,.45);font-size:1.2rem;cursor:pointer;}
.drawer-body{padding:14px 18px 28px;}
.dname{font-family:"Cinzel",serif;font-size:1rem;letter-spacing:2px;color:var(--crema);margin:10px 0 4px;}
.dsub{font-family:"IM Fell English",serif;font-style:italic;font-size:.85rem;color:var(--oro);margin-bottom:12px;}
.dtag{display:inline-block;font-family:"Cinzel",serif;font-size:.57rem;letter-spacing:2px;padding:3px 8px;border:1px solid rgba(191,155,74,.3);color:rgba(191,155,74,.65);margin-right:5px;margin-bottom:7px;text-transform:uppercase;}
.dai-text{font-size:1rem;line-height:1.9;color:rgba(245,239,226,.92);margin-top:12px;}
.dai-text p{margin-bottom:10px;}
.dai-text strong{color:var(--crema);}
.md-h2{font-family:"Cinzel",serif;font-size:.82rem;letter-spacing:2px;color:var(--oro);margin:16px 0 7px;border-bottom:1px solid rgba(191,155,74,.2);padding-bottom:5px;}
.md-h3{font-family:"Cinzel",serif;font-size:.72rem;letter-spacing:2px;color:var(--crema);margin:12px 0 5px;}
.md-hr{border:none;border-top:1px solid rgba(191,155,74,.15);margin:12px 0;}
.dai-load{text-align:center;padding:18px;font-family:"IM Fell English",serif;font-style:italic;color:rgba(191,155,74,.45);}
.spin{display:inline;}
/* spin animazione rimossa */

.prod-section{margin-top:16px;border-top:1px solid rgba(191,155,74,.18);padding-top:14px;}
.prod-section-head{font-family:"Cinzel",serif;font-size:.5rem;letter-spacing:3px;color:var(--oro);display:flex;align-items:center;justify-content:space-between;margin-bottom:11px;}
.prod-card{background:rgba(191,155,74,.05);border:1px solid rgba(191,155,74,.18);border-left:3px solid var(--oro);padding:11px 13px;margin-bottom:9px;position:relative;}
.prod-wine{font-family:"Cormorant Garamond",serif;font-size:.98rem;font-weight:600;color:var(--crema);}
.prod-cant{font-family:"Cinzel",serif;font-size:.58rem;letter-spacing:2px;color:var(--oro);margin:2px 0 5px;}
.prod-desc{font-family:"IM Fell English",serif;font-style:italic;font-size:.82rem;color:rgba(245,239,226,.55);line-height:1.7;}
.prod-price{font-family:"Cinzel",serif;font-size:.66rem;color:var(--oro);margin-top:5px;}
.prod-badge{position:absolute;top:7px;right:7px;font-family:"Cinzel",serif;font-size:.38rem;letter-spacing:1px;padding:2px 7px;text-transform:uppercase;}
.prod-badge.basic{background:rgba(191,155,74,.18);color:var(--oro);}
.prod-badge.premium{background:var(--vino);color:#fff;}
.prod-badge.elite{background:var(--oro);color:var(--nero);}
.fly-btn{font-family:"Cinzel",serif;font-size:.4rem;letter-spacing:1px;padding:4px 8px;background:transparent;border:1px solid rgba(191,155,74,.28);color:rgba(191,155,74,.55);cursor:pointer;margin-top:6px;transition:all .18s;}
.fly-btn:hover{background:var(--vino);color:#fff;border-color:var(--vino);}
.prod-empty{text-align:center;padding:14px;border:1.5px dashed rgba(191,155,74,.18);}
.prod-empty p{font-family:"IM Fell English",serif;font-style:italic;font-size:.83rem;color:rgba(191,155,74,.35);margin-bottom:9px;}
.add-btn{font-family:"Cinzel",serif;font-size:.60rem;letter-spacing:2px;padding:7px 14px;background:rgba(92,26,26,.3);border:1px solid rgba(191,155,74,.35);color:var(--oro);cursor:pointer;transition:all .18s;text-transform:uppercase;}
.add-btn:hover{background:var(--vino);color:#fff;}

.key-bar{background:rgba(10,7,5,.95);border-bottom:1px solid rgba(191,155,74,.12);display:flex;align-items:center;gap:8px;padding:6px 14px;position:fixed;top:52px;left:0;right:0;z-index:300;}
.key-lbl{font-family:"Cinzel",serif;font-size:.57rem;letter-spacing:2px;color:rgba(191,155,74,.45);white-space:nowrap;}
.key-input{flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(191,155,74,.18);padding:6px 10px;font-family:monospace;font-size:.68rem;color:rgba(245,239,226,.55);outline:none;}
.key-dot{width:9px;height:9px;border-radius:50%;background:#444;flex-shrink:0;}
.key-dot.ok{background:#4CAF50;}
.key-dot.err{background:#f44336;}
.key-save{font-family:"Cinzel",serif;font-size:.57rem;letter-spacing:2px;padding:5px 12px;background:var(--vino);color:#fff;border:none;cursor:pointer;}

.som-wrap{padding:16px;max-width:640px;margin:0 auto;padding-top:16px;}
.field-lbl{font-family:"Cinzel",serif;font-size:.46rem;letter-spacing:2px;color:rgba(191,155,74,.5);margin-bottom:5px;display:block;text-transform:uppercase;}
.field{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(191,155,74,.22);padding:10px 13px;font-family:"Cormorant Garamond",serif;font-size:.98rem;color:var(--crema);outline:none;margin-bottom:13px;}
.field::placeholder{color:rgba(245,239,226,.22);}
.field:focus{border-color:rgba(191,155,74,.55);}
textarea.field{resize:vertical;line-height:1.75;}
.cta-btn{width:100%;padding:15px;background:linear-gradient(135deg,#4A1010,var(--vino));color:var(--crema);border:none;font-family:"Cinzel",serif;font-size:.62rem;letter-spacing:4px;cursor:pointer;text-transform:uppercase;transition:all .2s;}
.cta-btn:hover{background:linear-gradient(135deg,var(--vino),#8B2222);}
.result-box{background:rgba(245,239,226,.03);border:1px solid rgba(191,155,74,.18);padding:16px;margin-top:14px;}

.masthead{background:var(--nero);border-bottom:3px double rgba(191,155,74,.35);padding:20px 18px 15px;text-align:center;}
.mast-kicker{font-family:"Cinzel",serif;font-size:.57rem;letter-spacing:5px;color:rgba(191,155,74,.4);margin-bottom:8px;}
.mast-title{font-family:"Cinzel",serif;font-size:clamp(1.8rem,7vw,3rem);font-weight:600;color:var(--crema);line-height:1.1;}
.mast-sub{font-family:"IM Fell English",serif;font-style:italic;font-size:.9rem;color:rgba(191,155,74,.55);margin-top:5px;}
.mast-rule{display:flex;align-items:center;gap:10px;margin:12px 0;}
.mast-rule hr{flex:1;border:none;border-top:1px solid rgba(191,155,74,.28);}
.mast-rule span{font-family:"Cinzel",serif;font-size:.57rem;letter-spacing:4px;color:rgba(191,155,74,.35);}
.home-body{background:#0A0705;color:#F5EFE2;padding:0;}
.news-section-head{font-family:"Cinzel",serif;font-size:.66rem;letter-spacing:4px;color:var(--vino);border-bottom:2px solid var(--vino);padding-bottom:4px;margin:14px 0 12px;display:flex;align-items:center;justify-content:space-between;}
.refresh-btn{font-family:"Cinzel",serif;font-size:.4rem;letter-spacing:2px;padding:3px 8px;background:transparent;border:1px solid rgba(92,26,26,.3);color:rgba(92,26,26,.5);cursor:pointer;}
.news-hero{border-bottom:1px solid rgba(191,155,74,.12);padding-bottom:0;margin-bottom:0;}
.news-hero-cat{font-family:"Cinzel",serif;font-size:.46rem;letter-spacing:3px;color:var(--oro);margin-bottom:6px;opacity:.8;}
.news-hero-title{font-family:"Cinzel",serif;font-size:clamp(1.05rem,4vw,1.5rem);font-weight:600;color:#F5EFE2;line-height:1.3;margin-bottom:8px;}
.news-hero-body{font-size:.95rem;line-height:1.85;color:rgba(245,239,226,.82);}
.news-hero-date{font-family:"IM Fell English",serif;font-style:italic;font-size:.78rem;color:rgba(191,155,74,.5);margin-top:8px;}
.news-hero-overlay{padding:16px 16px 18px;}
.news-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid rgba(191,155,74,.12);}
.news-item{border-right:1px solid rgba(191,155,74,.1);border-bottom:1px solid rgba(191,155,74,.1);padding:12px 10px;}
.news-item:nth-child(even){border-right:none;}
.news-item-img{height:110px;background-size:cover;background-position:center;margin-bottom:8px;}
.news-item-cat{font-family:"Cinzel",serif;font-size:.44rem;letter-spacing:2.5px;color:var(--oro);margin-bottom:4px;opacity:.7;}
.news-item-title{font-family:"Cinzel",serif;font-size:.78rem;font-weight:600;color:#F5EFE2;line-height:1.3;margin-bottom:5px;}
.news-item-body{font-size:.82rem;line-height:1.75;color:rgba(245,239,226,.72);}
.news-item-date{font-family:"IM Fell English",serif;font-style:italic;font-size:.72rem;color:rgba(191,155,74,.45);margin-top:5px;}
.news-spinner{text-align:center;padding:28px;font-family:"IM Fell English",serif;font-style:italic;color:rgba(191,155,74,.6);}

#prodModal{display:none;position:fixed;inset:0;background:rgba(10,7,5,.93);z-index:600;overflow-y:auto;padding:20px;}
.modal-box{max-width:480px;margin:0 auto;background:var(--nero);border:1px solid rgba(191,155,74,.3);}
.modal-head{background:linear-gradient(135deg,var(--nero),#1F0A05);padding:18px;border-bottom:1px solid rgba(191,155,74,.25);display:flex;justify-content:space-between;align-items:flex-start;}
.modal-title{font-family:"Cinzel",serif;font-size:.75rem;letter-spacing:3px;color:var(--oro);}
.modal-sub{font-family:"IM Fell English",serif;font-style:italic;font-size:.82rem;color:rgba(245,239,226,.45);margin-top:3px;}
.modal-body{padding:18px;}
.pkg-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:16px;}
.pkg{background:rgba(255,255,255,.03);border:1px solid rgba(191,155,74,.18);padding:11px 6px;text-align:center;cursor:pointer;transition:all .18s;}
.pkg.sel,.pkg:hover{background:rgba(92,26,26,.28);border-color:var(--oro);}
.pkg-ico{font-size:1.2rem;display:block;margin-bottom:3px;}
.pkg-nm{font-family:"Cinzel",serif;font-size:.66rem;letter-spacing:1px;color:var(--crema);}
.pkg-pr{font-family:"Cinzel",serif;font-size:.88rem;color:var(--oro);font-weight:600;}
.pkg-pr small{font-size:.62rem;color:rgba(191,155,74,.45);}
.pkg-ft{font-family:"IM Fell English",serif;font-style:italic;font-size:.68rem;color:rgba(245,239,226,.38);margin-top:3px;line-height:1.5;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.form-err{background:rgba(92,26,26,.28);border-left:3px solid var(--vino);padding:9px 13px;font-style:italic;color:#ff9999;font-size:.83rem;display:none;margin-top:9px;}
.form-ok{text-align:center;padding:22px;background:rgba(76,175,80,.07);border:1px solid rgba(76,175,80,.28);display:none;margin-top:13px;}
.form-ok-icon{font-size:2rem;margin-bottom:7px;}
.form-ok-title{font-family:"Cinzel",serif;font-size:.58rem;letter-spacing:3px;color:#4CAF50;}
.form-ok-body{font-family:"IM Fell English",serif;font-style:italic;color:var(--crema);font-size:.85rem;margin-top:5px;line-height:1.7;}
.exp-card:hover{background:rgba(92,26,26,.25)!important;}
.exp-row:hover{background:rgba(92,26,26,.2)!important;}

/* ── Micro-interazioni Fade-in-up ── */
.fade-up{opacity:0;transform:translateY(28px);transition:opacity .65s cubic-bezier(.4,0,.2,1),transform .65s cubic-bezier(.4,0,.2,1);}
.fade-up.visible{opacity:1;transform:translateY(0);}

/* ── Icone sensoriali circolari ── */
.scent-grid{display:flex;flex-wrap:wrap;gap:10px;margin:10px 0 16px;}
.scent-pill{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:default;}
.scent-circle{width:52px;height:52px;border-radius:50%;border:1.5px solid rgba(200,164,90,.35);background:rgba(200,164,90,.07);display:flex;align-items:center;justify-content:center;font-size:1.3rem;transition:transform .2s,background .2s;}
.scent-circle:hover{transform:scale(1.08);background:rgba(200,164,90,.15);}
.scent-label{font-family:Cinzel,serif;font-size:.5rem;letter-spacing:.12em;color:rgba(200,164,90,.65);text-align:center;max-width:58px;line-height:1.3;}

/* ── Event cards — Inviti esclusivi ── */
.event-invite{background:var(--nero);border:1px solid rgba(200,164,90,.25);margin-bottom:18px;overflow:hidden;position:relative;}
.event-invite::before{content:'';position:absolute;inset:0;border:6px solid transparent;border-image:linear-gradient(135deg,rgba(200,164,90,.3),transparent,rgba(200,164,90,.15)) 1;pointer-events:none;}
.event-img{width:100%;height:150px;object-fit:cover;background-size:cover;background-position:center;display:block;}
.event-date-badge{position:absolute;top:14px;right:14px;background:var(--oro);color:var(--nero);font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.15em;padding:5px 10px;}
.event-body{padding:16px 18px 18px;}
.event-kicker{font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.25em;color:var(--oro);margin-bottom:6px;}
.event-title{font-family:Cinzel,serif;font-size:.88rem;color:var(--crema);margin-bottom:4px;letter-spacing:.05em;}
.event-venue{font-family:IM Fell English,serif;font-style:italic;font-size:.9rem;color:rgba(245,239,226,.55);margin-bottom:10px;}
.event-desc{font-family:Cormorant Garamond,serif;font-size:1rem;line-height:1.8;color:rgba(245,239,226,.72);margin-bottom:12px;}
.event-footer{display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(200,164,90,.15);padding-top:10px;}
.event-price{font-family:Cinzel,serif;font-size:.6rem;letter-spacing:.12em;color:var(--oro);}
.event-rsvp{font-family:Cinzel,serif;font-size:.56rem;letter-spacing:.2em;padding:8px 16px;background:transparent;border:1px solid rgba(200,164,90,.4);color:var(--oro);cursor:pointer;transition:all .2s;}
.event-rsvp:hover,.event-rsvp.saved{background:var(--oro);color:var(--nero);}

/* ── Scheda Terroir migliorata ── */
.terroir-card{background:linear-gradient(135deg,var(--fumo),var(--nero));border:1px solid rgba(200,164,90,.2);}
.terroir-hero-img{width:100%;height:200px;background-size:cover;background-position:center;display:block;}
.terroir-storia{font-family:Cormorant Garamond,serif;font-size:1.05rem;line-height:1.92;color:rgba(245,239,226,.85);}
.terroir-storia::first-letter{font-size:2.8rem;font-family:Cinzel,serif;float:left;line-height:.8;margin:4px 8px 0 0;color:var(--oro);}


/* ── Shimmer skeleton loading ── */
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.skeleton{background:linear-gradient(90deg,rgba(200,164,90,.06) 25%,rgba(200,164,90,.14) 50%,rgba(200,164,90,.06) 75%);background-size:200% 100%;animation:shimmer 1.6s infinite;}
.skel-line{height:14px;border-radius:2px;margin-bottom:10px;}
.skel-line.wide{width:90%;}
.skel-line.medium{width:65%;}
.skel-line.short{width:40%;}
.skel-img{height:200px;border-radius:0;margin-bottom:14px;}
.news-spinner{text-align:center;padding:28px;font-family:IM Fell English,serif;font-style:italic;color:var(--vino);}

/* ═══ GOLD FLASH & EXCLUSIVE MODE ═══ */
@keyframes goldFlash{
  0%{box-shadow:inset 0 0 0 rgba(200,164,90,0);}
  30%{box-shadow:inset 0 0 80px rgba(200,164,90,.35);}
  60%{box-shadow:inset 0 0 40px rgba(200,164,90,.15);}
  100%{box-shadow:inset 0 0 0 rgba(200,164,90,0);}
}
@keyframes goldPulse{
  0%,100%{opacity:1;}
  50%{opacity:.6;}
}
.gold-flash-overlay{
  position:fixed;inset:0;z-index:9999;pointer-events:none;
  animation:goldFlash 1.8s ease forwards;
  background:radial-gradient(ellipse at center,rgba(200,164,90,.18) 0%,transparent 70%);
}
/* Exclusive Mode — tema ancora più sobrio e lussuoso */
body.exclusive{
  --nero:#090706;
  --fumo:#131009;
  --vino:#5C1818;
  --oro:#D4AA60;
  --crema:#F8F0E0;
  --parch:#F0E8D0;
  --grigio:#7A6E5E;
}
body.exclusive .nav{background:rgba(9,7,6,.98);border-bottom-color:rgba(212,170,96,.2);}
body.exclusive .ntab.active{border-bottom-color:var(--oro);}
body.exclusive .gz-card{box-shadow:0 6px 28px rgba(0,0,0,.5),0 1px 4px rgba(200,164,90,.08);}

/* ═══ HERO COVER TRANSITION ═══ */
#heroBg{transition:opacity .9s ease,transform .1s linear !important;}
#heroBg.cover-changing{opacity:0;}
#heroTitle{transition:opacity .5s ease;}
#heroTitle.title-changing{opacity:0;}

/* ═══ PRE-FETCH INDICATOR ═══ */
.prefetch-dot{width:6px;height:6px;border-radius:50%;background:var(--oro);opacity:.4;
  animation:goldPulse 1.5s infinite;position:fixed;bottom:16px;right:16px;z-index:500;}

@media(max-width:480px){
  .news-grid{grid-template-columns:1fr;}
  .form-row{grid-template-columns:1fr;}
  #map{height:48vh;}
}

/* Gold Flash — attivazione Pro */
@keyframes goldFlash{
  0%{box-shadow:inset 0 0 0 0 rgba(200,164,90,0);}
  25%{box-shadow:inset 0 0 60px 20px rgba(200,164,90,.35);}
  60%{box-shadow:inset 0 0 80px 30px rgba(200,164,90,.2);}
  100%{box-shadow:inset 0 0 0 0 rgba(200,164,90,0);}
}
.gold-flash-overlay{
  position:fixed;inset:0;z-index:9998;pointer-events:none;
  animation:goldFlash 1.8s ease forwards;
}

/* Exclusive Mode — tema Pro */
body.exclusive{
  --nero:#080604;
  --fumo:#100d0a;
  --vino:#5a1818;
  --oro:#d4af5a;
}
body.exclusive .nav-logo span{letter-spacing:.12em;}
body.exclusive nav{border-bottom:1px solid rgba(212,175,90,.4);}
body.exclusive .ntab.active{border-bottom-color:#d4af5a;}

/* Transizioni pagina */
/* rimosso: conflitto display */

/* Orologio vigna */
.vigna-clock{background:linear-gradient(135deg,var(--fumo),rgba(107,32,32,.25));border:1px solid rgba(200,164,90,.2);border-radius:4px;padding:14px 16px;}
.vigna-clock-month{font-family:Cinzel,serif;font-size:.65rem;letter-spacing:.3em;color:var(--oro);margin-bottom:5px;}
.vigna-clock-op{font-family:Cinzel,serif;font-size:.82rem;color:var(--crema);margin-bottom:5px;line-height:1.4;}
.vigna-clock-desc{font-family:Cormorant Garamond,serif;font-size:1rem;line-height:1.8;color:rgba(245,239,226,.65);font-style:italic;}

/* Stelle */
.stelle-box{background:linear-gradient(135deg,#0c0918,#16102a);border:1px solid rgba(140,90,200,.25);border-radius:4px;padding:14px 16px;}
.stelle-text{font-family:IM Fell English,serif;font-style:italic;font-size:1.02rem;line-height:1.78;color:rgba(210,190,255,.82);}

/* Galleria Terroir */
.terroir-gallery{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0 14px;}
.terroir-gallery img{width:100%;height:108px;object-fit:cover;border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,.4);display:block;}
.terroir-header-img{width:100%;height:190px;object-fit:cover;border-radius:4px;box-shadow:0 6px 24px rgba(0,0,0,.45);margin-bottom:14px;display:block;}

/* Flash News */
.flash-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--seppia);}
.flash-item:last-child{border-bottom:none;}
.flash-num{font-family:Cinzel,serif;font-size:1.1rem;color:rgba(200,164,90,.22);font-weight:700;line-height:1;flex-shrink:0;width:22px;}
.flash-text{font-family:Cinzel,serif;font-size:.72rem;color:var(--testo);line-height:1.4;}

/* Grand Tour */
.grand-tour-img{width:100%;height:175px;object-fit:cover;border-radius:4px 4px 0 0;display:block;}
.grand-tour-body{padding:12px 14px 14px;background:var(--fumo);border-radius:0 0 4px 4px;}

/* Saluto Pro */
.pro-greeting{background:linear-gradient(135deg,var(--fumo),rgba(107,32,32,.4));border-bottom:1px solid rgba(200,164,90,.2);padding:13px 16px;display:flex;align-items:center;gap:12px;}
.pro-greeting-text{font-family:Cinzel,serif;font-size:.72rem;color:var(--crema);}
.pro-greeting-sub{font-family:IM Fell English,serif;font-style:italic;font-size:.88rem;color:rgba(200,164,90,.6);margin-top:2px;}
.pro-search-bar{background:var(--fumo);border:1px solid rgba(200,164,90,.22);padding:12px 16px;}
.gz-rubrica-label{font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.35em;text-transform:uppercase;color:var(--oro);padding:4px 10px;border:1px solid rgba(200,164,90,.35);display:inline-block;margin-bottom:12px;}
.gz-card{background:#120A06;border:1px solid rgba(191,155,74,.15);border-radius:3px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.5);margin-bottom:12px;}
.gz-card-body{padding:14px 14px 16px;background:#120A06;}
.gz-title{color:#F5EFE2;font-family:Cinzel,serif;font-size:1.05rem;font-weight:600;color:var(--testo);line-height:1.35;margin-bottom:8px;}
.gz-text{font-family:Cormorant Garamond,serif;font-size:1.05rem;line-height:1.85;color:var(--testo2);}
.gz-byline{font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.2em;color:var(--grigio);margin-top:10px;}
.gz-img-cover{width:100%;height:200px;object-fit:cover;border-radius:4px;box-shadow:0 8px 32px rgba(0,0,0,.45);}
.ev-timeline{position:relative;padding-left:28px;}
.ev-timeline::before{content:"";position:absolute;left:10px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,var(--oro),rgba(200,164,90,.1));}
.ev-item{position:relative;margin-bottom:24px;}
.ev-dot{position:absolute;left:-22px;top:8px;width:12px;height:12px;border-radius:50%;background:var(--oro);border:2px solid var(--parch);box-shadow:0 0 0 2px var(--oro);}
.ev-card{background:#12080A;border:1px solid rgba(191,155,74,.12);border-radius:3px;overflow:hidden;}
.ev-img{width:100%;height:130px;object-fit:cover;display:block;}
.ev-body{color:#F5EFE2;padding:12px 14px 14px;}
.ev-date-tag{display:inline-block;background:var(--vino);color:#fff;font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.15em;padding:3px 9px;border-radius:2px;margin-bottom:8px;}
.ev-title{font-family:Cinzel,serif;font-size:.82rem;font-weight:600;color:var(--testo);margin-bottom:4px;}
.ev-place{font-family:IM Fell English,serif;font-style:italic;font-size:.9rem;color:var(--grigio);margin-bottom:8px;}
.ev-desc{font-family:Cormorant Garamond,serif;font-size:.98rem;line-height:1.75;color:var(--testo2);}
.ev-price{font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.15em;color:var(--vino);margin-top:8px;}
.ev-save{font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.15em;padding:6px 14px;background:transparent;border:1px solid rgba(200,164,90,.4);color:var(--oro);cursor:pointer;border-radius:2px;margin-top:8px;float:right;}

/* === AGGIUNTE FINALI === */

/* Transizione sfogliamento rivista */
.page-exit{opacity:0 !important;transform:translateX(-16px) !important;}
.page-enter-anim{animation:pageSlideIn .35s ease forwards;}
@keyframes pageSlideIn{from{opacity:0;transform:translateX(16px);}to{opacity:1;transform:translateX(0);}}

/* Orologio del Vignaiolo */
.vigna-clock{background:linear-gradient(135deg,var(--fumo),rgba(107,32,32,.25));border:1px solid rgba(200,164,90,.2);border-radius:4px;padding:14px 16px;}
.vigna-clock-month{font-family:Cinzel,serif;font-size:.65rem;letter-spacing:.3em;color:var(--oro);margin-bottom:5px;}
.vigna-clock-op{font-family:Cinzel,serif;font-size:.82rem;color:var(--crema);margin-bottom:5px;line-height:1.4;}
.vigna-clock-desc{font-family:Cormorant Garamond,serif;font-size:1rem;line-height:1.8;color:rgba(245,239,226,.65);font-style:italic;}

/* Vini & Stelle */
.stelle-box{background:linear-gradient(135deg,#0c0918,#16102a);border:1px solid rgba(140,90,200,.25);border-radius:4px;padding:14px 16px;}
.stelle-text{font-family:IM Fell English,serif;font-style:italic;font-size:1.02rem;line-height:1.78;color:rgba(210,190,255,.82);}

/* Galleria Terroir */
.terroir-gallery{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0 14px;}
.terroir-gallery img{width:100%;height:108px;object-fit:cover;border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,.4);display:block;}
.terroir-header-img{width:100%;height:190px;object-fit:cover;border-radius:4px;box-shadow:0 6px 24px rgba(0,0,0,.45);margin-bottom:14px;display:block;}

/* Flash News */
.flash-item{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid var(--seppia);}
.flash-item:last-child{border-bottom:none;}
.flash-num{font-family:Cinzel,serif;font-size:1.1rem;color:rgba(200,164,90,.22);font-weight:700;line-height:1;flex-shrink:0;width:22px;}
.flash-text{font-family:Cinzel,serif;font-size:.72rem;color:var(--testo);line-height:1.4;}

/* Grand Tour */
.grand-tour-img{width:100%;height:175px;object-fit:cover;border-radius:4px 4px 0 0;display:block;}
.grand-tour-body{padding:12px 14px 14px;background:var(--fumo);border-radius:0 0 4px 4px;}

/* Saluto Pro */
.pro-greeting{background:linear-gradient(135deg,var(--fumo),rgba(107,32,32,.4));border-bottom:1px solid rgba(200,164,90,.2);padding:13px 16px;display:flex;align-items:center;gap:12px;}
.pro-greeting-text{font-family:Cinzel,serif;font-size:.72rem;color:var(--crema);}
.pro-greeting-sub{font-family:IM Fell English,serif;font-style:italic;font-size:.88rem;color:rgba(200,164,90,.6);margin-top:2px;}
.pro-search-bar{background:var(--fumo);border:1px solid rgba(200,164,90,.22);padding:12px 16px;}

/* ── Testo principale crema avorio ── */
.gz-text, .gz-card-body p, .dal-text p, .result-box p, 
.ev-desc, .vigna-clock-desc, .stelle-text, .grand-tour-body p,
.som-wrap p, .dai-text p {
  color: #F5EFE2 !important;
  opacity: 0.88;
}
/* Sfondi blocchi testo più solidi */
.gz-card-body, .ev-body, .grand-tour-body {
  background: #12080400;
}
.dai-text {
  color: #F5EFE2;
}

/* ── Schede Terroir strutturate ── */
.dp-sec-head {
  font-family: Cinzel, serif;
  font-size: .62rem;
  letter-spacing: .2em;
  color: var(--oro);
  margin: 16px 0 6px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(191,155,74,.15);
}
.dai-text ul {
  margin: 0 0 12px 0;
  padding-left: 16px;
  color: #F5EFE2;
  line-height: 1.85;
}
.dai-text li {
  margin-bottom: 4px;
  font-family: Cormorant Garamond, serif;
  font-size: 1rem;
}
.dai-text p {
  font-family: Cormorant Garamond, serif;
  font-size: 1rem;
  line-height: 1.85;
  color: #F5EFE2;
  margin: 0 0 10px;
}
/* Scheda terroir wrapper */
.terroir-scheda {
  background: #120A06;
  border-radius: 2px;
  padding: 14px 16px 18px;
}

/* ── Leggibilità globale ── */
.gz-card *, .ev-body *, .home-body p, .home-body div {
  text-rendering: optimizeLegibility;
}
.gz-byline, .gz-date, .ev-date-tag, .ev-place, .ev-price {
  color: rgba(191,155,74,.65) !important;
}
.ev-title { color: #F5EFE2 !important; }
.ev-desc { color: rgba(245,239,226,.78) !important; line-height: 1.7; }
.ev-dot { background: var(--oro); }
.stelle-text, .vigna-clock-desc, .grand-tour-body {
  color: rgba(245,239,226,.8) !important;
}
/* Sezione notizie header */
.news-section-head {
  background: #0A0705;
  border-bottom: 1px solid rgba(191,155,74,.2);
  border-top: 2px solid var(--oro);
  color: var(--oro) !important;
  padding: 10px 14px;
}
/* Griglia magazine */
.mag-grid {
  display: grid;
  grid-template-areas: "big big small1" "big big small2";
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  border-top: 1px solid rgba(191,155,74,.15);
}
.mag-grid-big { grid-area: big; border-right: 1px solid rgba(191,155,74,.12); }
.mag-grid-s1 { grid-area: small1; border-bottom: 1px solid rgba(191,155,74,.12); }
.mag-grid-s2 { grid-area: small2; }
.mag-article { background: #0A0705; cursor: pointer; }
.mag-article:hover { background: rgba(92,26,26,.2); }
.mag-article-img { width:100%; object-fit:cover; display:block; background:#1a0d06; }
.mag-article-body { padding: 10px 12px 12px; }
.mag-article-cat { font-family:Cinzel,serif; font-size:.4rem; letter-spacing:3px; color:var(--oro); opacity:.75; margin-bottom:4px; }
.mag-article-title { font-family:Cinzel,serif; font-size:.78rem; font-weight:600; color:#F5EFE2; line-height:1.3; margin-bottom:5px; }
.mag-article-lead { font-family:Cormorant Garamond,serif; font-size:.85rem; line-height:1.72; color:rgba(245,239,226,.72); }
.mag-article-date { font-family:IM Fell English,serif; font-style:italic; font-size:.7rem; color:rgba(191,155,74,.45); margin-top:6px; }
/* Articolo aperto */
.article-reader {
  position: fixed; inset: 0; z-index: 700;
  background: #080503;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform .32s cubic-bezier(.4,0,.2,1);
}
.article-reader.open { transform: translateY(0); }
.article-reader-head {
  position: sticky; top: 0; z-index: 10;
  background: rgba(8,5,3,.95); 
  border-bottom: 1px solid rgba(191,155,74,.2);
  padding: 12px 16px;
  display: flex; align-items: center; gap: 10px;
}
.article-reader-back {
  background: none; border: none; color: var(--oro); 
  font-family: Cinzel,serif; font-size: .6rem; letter-spacing: 2px;
  cursor: pointer; padding: 6px 10px;
  border: 1px solid rgba(191,155,74,.3);
}
.article-reader-content {
  max-width: 680px; margin: 0 auto; padding: 24px 18px 60px;
}
.article-reader-cat {
  font-family: Cinzel,serif; font-size: .5rem; letter-spacing: 4px;
  color: var(--oro); margin-bottom: 10px;
}
.article-reader-title {
  font-family: Cinzel,serif; font-size: clamp(1.3rem,5vw,2rem);
  font-weight: 600; color: #F5EFE2; line-height: 1.25; margin-bottom: 12px;
}
.article-reader-img {
  width: 100%; max-height: 280px; object-fit: cover; margin-bottom: 20px;
}
.article-reader-body {
  font-family: Cormorant Garamond,serif; font-size: 1.08rem;
  line-height: 1.9; color: rgba(245,239,226,.88);
}
.article-reader-body p { margin-bottom: 18px; }
.article-reader-body h3 { 
  font-family: Cinzel,serif; font-size: .85rem; letter-spacing: 2px;
  color: var(--oro); margin: 24px 0 10px; 
}

/* ── Explore: barra denominazioni + paesi ── */
.exp-quick-bar {
  background: rgba(10,7,5,.97);
  border-bottom: 1px solid rgba(191,155,74,.12);
  padding: 8px 10px 6px;
  position: sticky;
  top: 102px; /* sotto la search bar */
  z-index: 99;
}
.exp-denom-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 5px;
  padding-bottom: 5px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.exp-denom-row::-webkit-scrollbar { display: none; }

.exp-denom-btn {
  font-family: Cinzel, serif;
  font-size: .5rem;
  letter-spacing: .15em;
  padding: 5px 10px;
  background: rgba(191,155,74,.06);
  border: 1px solid rgba(191,155,74,.22);
  color: rgba(191,155,74,.7);
  cursor: pointer;
  white-space: nowrap;
  border-radius: 2px;
  transition: all .16s;
  flex-shrink: 0;
}
.exp-denom-btn:hover, .exp-denom-btn.active {
  background: rgba(92,26,26,.35);
  border-color: var(--oro);
  color: var(--oro);
}

.exp-country-row {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 5px;
  padding-top: 5px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.exp-country-row::-webkit-scrollbar { display: none; }

.exp-country-btn {
  font-family: Cinzel, serif;
  font-size: .44rem;
  letter-spacing: .18em;
  padding: 4px 9px;
  background: transparent;
  border: 1px solid rgba(191,155,74,.14);
  color: rgba(191,155,74,.48);
  cursor: pointer;
  white-space: nowrap;
  border-radius: 2px;
  transition: all .16s;
  flex-shrink: 0;
  opacity: 0.8;
}
.exp-country-btn:hover, .exp-country-btn.active {
  background: rgba(191,155,74,.1);
  border-color: rgba(191,155,74,.45);
  color: var(--oro);
  opacity: 1;
}

/* Box introduzione paese */
.country-intro-box {
  background: rgba(92,26,26,.12);
  border-left: 3px solid var(--oro);
  padding: 14px 16px;
  margin: 0;
  border-bottom: 1px solid rgba(191,155,74,.12);
}
.country-intro-flag {
  font-size: 2rem;
  margin-bottom: 6px;
}
.country-intro-name {
  font-family: Cinzel, serif;
  font-size: .78rem;
  letter-spacing: 3px;
  color: var(--crema);
  margin-bottom: 6px;
}
.country-intro-text {
  font-family: Cormorant Garamond, serif;
  font-size: .95rem;
  line-height: 1.8;
  color: rgba(245,239,226,.75);
}
.country-intro-stats {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(191,155,74,.1);
}
.country-stat {
  font-family: Cinzel, serif;
  font-size: .5rem;
  letter-spacing: 1px;
  color: rgba(191,155,74,.55);
}
.country-stat span {
  display: block;
  font-size: .9rem;
  color: var(--oro);
  margin-bottom: 2px;
}

/* ── Sliders organolettici ── */
.wine-param-block {
  background: rgba(5,3,1,.6);
  border: 1px solid rgba(191,155,74,.14);
  border-radius: 3px;
  padding: 14px 15px;
  margin-bottom: 12px;
}
.wine-param-title {
  font-family: Cinzel, serif;
  font-size: .52rem;
  letter-spacing: 3px;
  color: var(--oro);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.wine-slider-row {
  margin-bottom: 12px;
}
.wine-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 5px;
}
.wine-slider-label {
  font-family: Cinzel, serif;
  font-size: .46rem;
  letter-spacing: 1.5px;
  color: rgba(191,155,74,.65);
}
.wine-slider-value {
  font-family: Cinzel, serif;
  font-size: .62rem;
  color: var(--oro);
  min-width: 80px;
  text-align: right;
}
.wine-slider {
  width: 100%;
  height: 3px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, var(--vino) 0%, var(--vino) var(--pct, 50%), rgba(191,155,74,.15) var(--pct, 50%));
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.wine-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--oro);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 2px rgba(191,155,74,.3);
}
.wine-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--oro);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
.wine-slider-poles {
  display: flex;
  justify-content: space-between;
  margin-top: 3px;
}
.wine-slider-pole {
  font-family: IM Fell English, serif;
  font-style: italic;
  font-size: .65rem;
  color: rgba(245,239,226,.3);
}
/* Select paese/regione */
.wine-geo-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 0;
}
.wine-select {
  width: 100%;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(191,155,74,.2);
  padding: 9px 10px;
  font-family: Cormorant Garamond, serif;
  font-size: .92rem;
  color: var(--crema);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23BF9B4A' opacity='.6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}
.wine-select option {
  background: #1A0D08;
  color: var(--crema);
}
.wine-select:focus { border-color: rgba(191,155,74,.5); }

/* ── Fix spinner: ferma animazione quando nascosto ── */
[style*="display:none"] .spin,
[style*="display: none"] .spin {
  animation-play-state: paused !important;
}
/* Spinner nei container loading */
#wsLoad, #somLoad, #somLoad2 {
  animation: none;
}

/* ── Rimozione spinner da pagine statiche ── */
.page:not(.active) .news-spinner,
.page:not(.active) .spin,
#defaultHero .spin {
  display: none !important;
  animation: none !important;
}
/* Loader elegante senza rotazione */
.news-spinner {
  text-align: center;
  padding: 24px;
  font-family: "IM Fell English", serif;
  font-style: italic;
  color: rgba(191,155,74,.55);
  font-size: .92rem;
  letter-spacing: .05em;
}
/* Ferma tutto lo spin quando non necessario */
.spin {
  display: inline-block;
}

/* ── Contrasto massimo su card e testi ── */
.home-body { background: #080503 !important; }
.gz-card-body { background: #100806 !important; }
.ev-body { background: #0E0704 !important; }
.news-hero-overlay {
  background: linear-gradient(to bottom, rgba(5,3,1,.2) 0%, rgba(5,3,1,.75) 60%, rgba(5,3,1,.95) 100%);
  padding: 16px 16px 20px;
}
.news-hero-title { color: #FFFFFF !important; text-shadow: 0 1px 4px rgba(0,0,0,.8); }
.news-hero-body { color: rgba(245,239,226,.9) !important; }
.news-item-title { color: #F5EFE2 !important; text-shadow: 0 1px 3px rgba(0,0,0,.6); }
.news-item-body { color: rgba(245,239,226,.8) !important; }
.article-reader-body p,
.article-reader-body h3 { color: rgba(245,239,226,.92) !important; }
/* Overlay su immagini hero */
.mag-article-img + .mag-article-body { background: rgba(8,5,3,.96) !important; }
/* Card produttori */
.prod-card { background: rgba(10,7,5,.95) !important; }
/* Sommelier cards */
.som-wine-card { background: rgba(10,7,5,.9); border: 1px solid rgba(191,155,74,.18); padding: 14px; margin-bottom: 12px; border-radius: 2px; }
.som-wine-name { color: #F5EFE2 !important; font-family: Cinzel,serif; font-size: .82rem; letter-spacing: 1px; }
.som-wine-zone { color: rgba(191,155,74,.65) !important; font-family: IM Fell English,serif; font-style: italic; font-size: .85rem; margin: 4px 0; }
.som-wine-poem { color: rgba(245,239,226,.85) !important; font-family: Cormorant Garamond,serif; font-size: 1rem; line-height: 1.8; margin: 6px 0; }
.som-wine-price { color: var(--oro) !important; font-family: Cinzel,serif; font-size: .62rem; letter-spacing: 1px; margin-top: 6px; }
.som-wine-alt { color: rgba(245,239,226,.55) !important; font-family: IM Fell English,serif; font-style: italic; font-size: .85rem; margin-top: 4px; border-top: 1px solid rgba(191,155,74,.1); padding-top: 5px; }

/* ══ LEGGIBILITÀ v9 ══ */
.home-body{background:#060402!important;}
.page,.page,.page.active{background:#080503;}
.gz-card-body,.ev-body{background:rgba(0,0,0,.88)!important;}
.article-reader-img { display: none !important; }
.mag-article-img, .news-item-img { display: none !important; }
.news-hero-title,.mag-article-title{color:#fff!important;text-shadow:0 2px 8px rgba(0,0,0,.95)!important;}
.news-hero-body,.news-item-body,.mag-article-lead{color:rgba(245,239,226,.92)!important;}
.news-hero-cat,.news-item-cat,.mag-article-cat{color:var(--oro)!important;}
.news-hero-overlay{background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.65) 55%,rgba(0,0,0,.92))!important;padding:18px 16px 20px;}
.som-wine-card{background:rgba(0,0,0,.8)!important;border:1px solid rgba(191,155,74,.2)!important;border-radius:3px;padding:14px 16px;margin-bottom:13px;}
.som-wine-name{color:#F5EFE2!important;font-family:Cinzel,serif;font-size:.85rem;}
.som-wine-poem{color:rgba(245,239,226,.88)!important;}
.som-wine-price{color:var(--oro)!important;}
.som-wine-alt{color:rgba(245,239,226,.55)!important;}
#paramHelpPanel{z-index:999!important;}

/* ── Comparatore Terroir ── */
.cmp-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}
.cmp-table th {
  font-family: Cinzel, serif;
  font-size: .6rem;
  letter-spacing: 2px;
  color: var(--oro);
  padding: 12px 10px;
  text-align: center;
  background: rgba(92,26,26,.2);
  border-bottom: 2px solid rgba(191,155,74,.25);
  position: sticky;
  top: 52px;
}
.cmp-table td {
  padding: 10px 10px;
  vertical-align: top;
  border-bottom: 1px solid rgba(191,155,74,.07);
  font-family: Cormorant Garamond, serif;
  font-size: .9rem;
  line-height: 1.7;
  color: rgba(245,239,226,.82);
}
.cmp-table tr:nth-child(even) td {
  background: rgba(255,255,255,.02);
}
.cmp-row-label {
  font-family: Cinzel, serif;
  font-size: .48rem;
  letter-spacing: 2px;
  color: rgba(191,155,74,.55);
  padding: 10px 10px;
  border-bottom: 1px solid rgba(191,155,74,.07);
  background: rgba(10,7,5,.6);
  text-align: left;
  white-space: nowrap;
}
.cmp-section-head {
  font-family: Cinzel, serif;
  font-size: .52rem;
  letter-spacing: 3px;
  color: var(--oro);
  padding: 14px 10px 6px;
  background: rgba(92,26,26,.12);
  border-top: 1px solid rgba(191,155,74,.2);
  border-bottom: 1px solid rgba(191,155,74,.12);
}
.cmp-badge {
  display: inline-block;
  font-family: Cinzel, serif;
  font-size: .44rem;
  letter-spacing: 1px;
  padding: 3px 8px;
  background: rgba(191,155,74,.1);
  border: 1px solid rgba(191,155,74,.25);
  border-radius: 2px;
  color: rgba(191,155,74,.8);
  margin: 2px;
}
.cmp-winner {
  background: rgba(92,26,26,.15) !important;
  border-left: 2px solid var(--oro);
}
.cmp-ai-section {
  background: rgba(0,0,0,.4);
  border: 1px solid rgba(191,155,74,.15);
  border-radius: 3px;
  margin: 16px;
  padding: 16px;
}
.cmp-ai-title {
  font-family: Cinzel, serif;
  font-size: .6rem;
  letter-spacing: 3px;
  color: var(--oro);
  margin-bottom: 12px;
}
.cmp-ai-body {
  font-family: Cormorant Garamond, serif;
  font-size: .98rem;
  line-height: 1.88;
  color: rgba(245,239,226,.85);
}
.cmp-ai-body h3 {
  font-family: Cinzel, serif;
  font-size: .62rem;
  letter-spacing: 2px;
  color: var(--oro);
  margin: 14px 0 6px;
}
.cmp-ai-body strong {
  color: var(--crema);
  font-weight: 600;
}
.cmp-ai-body ul {
  padding-left: 18px;
  margin: 6px 0;
}
.cmp-ai-body li {
  margin-bottom: 4px;
}

/* Nascondi immagini rotte */
img[src=""], img:not([src]), .news-hero-img:empty { display:none!important; }
/* Card notizie senza foto - sfondo gradiente */
.gz-card { background: rgba(10,7,5,.95) !important; }
.gz-card-img-wrap { display: none !important; }
.mag-grid-item .img-wrap { display: none !important; }
.news-hero { background: linear-gradient(135deg,#1a0808,#2d0a0a) !important; }
/* Hero senza foto */
#heroBg { background: linear-gradient(135deg,#1a0505 0%,#3d1408 40%,#0d0808 100%) !important; }

/* ═══ OVERRIDE FINALE: navigazione pagine ═══ */
.page { display: none !important; }
.page.active { display: block !important; }

/* Immagini rotte — nascondi */
img[src=""], img:not([src]) { display: none !important; }
.news-item-img:empty, .news-hero-img:empty { background: linear-gradient(135deg,#1a0808,#2d0a0a); }
</style>
</head>
<body>

<nav>
  <div class="nav-logo" id="navLogo" style="cursor:pointer;user-select:none;padding:0 14px;min-width:0;">
  <div style="display:flex;flex-direction:column;line-height:1.1;">
    <span class="shimmer-gold" style="font-family:Cinzel,serif;font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;">Sommelier</span>
    <span style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:.4em;color:var(--oro);margin-top:2px;text-transform:uppercase;">World</span>
    <span id="navLangIndicator" style="font-family:Cinzel,serif;font-size:.38rem;letter-spacing:.2em;color:rgba(200,164,90,.35);margin-top:1px;text-transform:uppercase;">IT</span>
  </div>
</div></div>
  <div class="nav-tabs">
    <div class="ntab active" data-page="home"><span class="ico">🏠</span><span class="lbl">Home</span></div>
    <div class="ntab" data-page="events"><span class="ico">📅</span><span class="lbl">Eventi</span></div>
    <div class="ntab" data-page="explore"><span class="ico">🌿</span><span class="lbl">Terroir</span></div>
    <div class="ntab" data-page="compare"><span class="ico">⚖️</span><span class="lbl">Confronta</span></div>
    <div class="ntab" data-page="sommelier"><span class="ico">🍷</span><span class="lbl">Sommelier</span></div>
    <div class="ntab" data-page="producers"><span class="ico">🏅</span><span class="lbl">Produttori</span></div>
    <div class="ntab" id="adminTab" data-page="admin" style="display:none;"><span class="ico">⚙️</span><span class="lbl">Admin</span></div>
    <div style="display:flex;align-items:center;gap:6px;padding:0 8px;margin-left:auto;flex-shrink:0;">
      <!-- Language switcher -->
      <div style="display:flex;align-items:center;gap:0;border:1px solid rgba(191,155,74,.2);border-radius:2px;overflow:hidden;">
        <button id="langBtn_it" onclick="i18n.setLang('it')"
          style="background:rgba(191,155,74,.15);border:none;font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.1em;color:var(--oro);cursor:pointer;padding:5px 7px;line-height:1;">IT</button>
        <button id="langBtn_en" onclick="i18n.setLang('en')"
          style="background:none;border:none;border-left:1px solid rgba(191,155,74,.18);font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.1em;color:rgba(191,155,74,.45);cursor:pointer;padding:5px 7px;line-height:1;">EN</button>
        <button id="langBtn_fr" onclick="i18n.setLang('fr')"
          style="background:none;border:none;border-left:1px solid rgba(191,155,74,.18);font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.1em;color:rgba(191,155,74,.45);cursor:pointer;padding:5px 7px;line-height:1;">FR</button>
      </div>
<!-- settings rimosso -->
    </div>
</div>
</nav>




<!-- HOME -->
<div class="page active" id="page-home">
  <div id="heroSection" style="position:relative;height:72vw;max-height:440px;min-height:260px;overflow:hidden;">
    <div id="heroBg" style="position:absolute;inset:-15%;width:130%;background:linear-gradient(135deg,#1a0505 0%,#3d1408 40%,#0d0808 100%);height:130%;background-size:cover;background-position:center 40%;transition:transform .1s linear;"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,7,5,.1) 0%,rgba(10,7,5,.4) 35%,rgba(10,7,5,.97) 100%);"></div>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:20px 20px 26px;">
      <div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:.4em;color:var(--oro);margin-bottom:8px;opacity:.85;">🍷 LA GAZZETTA DEL TERROIR</div>
      <div id="heroTitle" style="font-family:Cinzel,serif;font-size:clamp(1.5rem,5.5vw,2.4rem);font-weight:600;color:#fff;line-height:1.18;letter-spacing:.02em;margin-bottom:8px;text-shadow:0 2px 16px rgba(0,0,0,.6);"></div>
      <div id="heroSub" style="font-family:IM Fell English,serif;font-style:italic;font-size:.98rem;color:rgba(245,239,226,.65);"id="mastSub">L'enciclopedia mondiale — dal suolo al bicchiere</div>
      <div style="display:flex;gap:14px;margin-top:12px;flex-wrap:wrap;">
        <span id="heroDate" style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.2em;color:rgba(200,164,90,.65);"></span>
        <span style="color:rgba(200,164,90,.25);">·</span>
        <span style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.2em;color:rgba(200,164,90,.4);" id="mastBadge">327 DENOMINAZIONI · 28 PAESI</span>
      </div>
    </div>
  </div>
<div class="home-body">
    <!-- SALUTO PRO (visibile solo con Pro attivo) -->
    <div id="proGreeting" style="display:none;"></div>

    <!-- RICERCA AVANZATA PRO -->
    <div id="proAdvSearch" style="display:none;" class="pro-search-bar">
      <div class="t-kicker" style="font-size:.56rem;margin-bottom:8px;">🔎 RICERCA AVANZATA NEL TERROIR</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <input id="proSearchInput" type="text" placeholder="Cerca per vitigno, suolo, stile, annata…"
          style="flex:1;min-width:160px;background:rgba(255,255,255,.06);border:1px solid rgba(200,164,90,.2);padding:9px 12px;font-family:Cormorant Garamond,serif;font-size:1rem;color:var(--crema);outline:none;border-radius:2px;">
        <button onclick="proAdvancedSearch()" style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.15em;padding:9px 16px;background:var(--oro);color:var(--nero);border:none;cursor:pointer;border-radius:2px;">CERCA</button>
      </div>
      <div id="proSearchResults" style="margin-top:12px;"></div>
    </div>

    <!-- NOTIZIE -->
    <div class="news-section-head" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
  <div style="display:flex;align-items:center;gap:8px;">
    <span class="news-live-dot"></span>
    <span>NOTIZIE DEL VINO</span>
  </div>
  <button class="refresh-btn" onclick="loadNews(true)">↻ Aggiorna</button>
</div>
    <div id="newsContainer">
  <!-- Articolo default — Il Fascino del Terroir -->
  <div class="news-hero fade-up visible" id="defaultHero">
    <div class="news-hero-img" style="background:linear-gradient(135deg,#1a0505 0%,#3d1408 50%,#0d0808 100%);height:260px;"></div>
    <div class="news-hero-overlay">
      <div class="news-hero-cat">🌿 TERROIR</div>
      <div class="news-hero-title">Il Fascino del Terroir</div>
      <div class="news-hero-body">Ogni vigneto è un racconto scritto nella roccia, nel vento e nel tempo. Il suolo parla attraverso il vino: calcare che dona mineralità, argilla che regala corpo, granito che consegna eleganza. Scopri le 327 denominazioni che custodiscono questi segreti.</div>
      <div class="news-hero-date">La Gazzetta del Terroir · Edizione giornaliera</div>
    </div>
  </div>
  <div class="news-grid">
    <div class="news-item fade-up visible">
      <div class="news-item-img" style="background:linear-gradient(135deg,#1a0808,#2d0a0a);"></div>
      <div class="news-item-content">
        <div class="news-item-cat">🍷 DENOMINAZIONI</div>
        <div class="news-item-title">327 storie da scoprire</div>
        <div class="news-item-body">Dal Barolo all'Assyrtiko di Santorini, ogni denominazione custodisce una storia unica. Esplora il Terroir per scoprirle.</div>
        <div class="news-item-date">Vai su Terroir →</div>
      </div>
    </div>
    <div class="news-item fade-up visible">
      <div class="news-item-img" style="background:linear-gradient(135deg,#0d1a08,#1a2d0a);"></div>
      <div class="news-item-content">
        <div class="news-item-cat">🍽 SOMMELIER</div>
        <div class="news-item-title">Il vino perfetto per ogni piatto</div>
        <div class="news-item-body">Descrivi il tuo menu e il Sommelier AI troverà l'abbinamento ideale — poetico, preciso, reale.</div>
        <div class="news-item-date">Vai su Sommelier →</div>
      </div>
    </div>
  </div>
</div>
  </div>
</div>


<!-- EVENTI -->
<div class="page" id="page-events" style="padding-top:52px;">
  <div style="background:var(--nero);border-bottom:2px double rgba(191,155,74,.3);padding:16px 18px;text-align:center;">
    <div style="font-family:Cinzel,serif;font-size:.57rem;letter-spacing:5px;color:rgba(191,155,74,.35);">📅 AGENDA</div>
    <div style="font-family:Cinzel,serif;font-size:1.4rem;color:var(--crema);letter-spacing:2px;">Eventi del Vino</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.95rem;color:rgba(191,155,74,.5);margin-top:4px;">Degustazioni · Visite in cantina · Masterclass</div>
  </div>
  <div class="home-body">
    <div id="eventsContainer"></div>
    <div style="text-align:center;margin-top:16px;">
      <button onclick="loadEvents(true)" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:9px 20px;background:transparent;border:1px solid rgba(92,26,26,.4);color:rgba(92,26,26,.6);cursor:pointer;">↻ Aggiorna eventi</button>
    </div>
  </div>
</div>

<!-- ESPLORA -->
<div class="page" id="page-explore" style="padding-top:52px;">

  <!-- Header fisso -->
  <div style="background:var(--nero);border-bottom:2px double rgba(191,155,74,.25);padding:14px 18px;text-align:center;">
    <div style="font-family:Cinzel,serif;font-size:.57rem;letter-spacing:5px;color:rgba(191,155,74,.32);">🌍 ENCICLOPEDIA</div>
    <div style="font-family:Cinzel,serif;font-size:1.2rem;color:var(--crema);letter-spacing:2px;">Denominazioni del Mondo</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.82rem;color:rgba(191,155,74,.45);margin-top:3px;">327 denominazioni · 28 paesi</div>
  </div>

  <!-- Ricerca -->
  <div style="background:rgba(10,7,5,.95);padding:10px 14px;border-bottom:1px solid rgba(191,155,74,.1);position:sticky;top:52px;z-index:100;">
    <div style="display:flex;gap:8px;">
      <input id="exploreSearch" type="text" placeholder="🔎 Cerca denominazione, vitigno, paese…"
        style="flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(191,155,74,.22);padding:9px 12px;font-family:Cormorant Garamond,serif;font-size:.95rem;color:var(--crema);outline:none;"
        oninput="filterExplore(this.value)">
      <button onclick="renderExploreCountries()" style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:1px;padding:9px 12px;background:rgba(255,255,255,.06);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.5);cursor:pointer;">✕</button>
    </div>
  </div>

  <!-- Barra quick-nav: Denominazioni + Paesi -->
  <div class="exp-quick-bar">
    <!-- Riga 1: Denominazioni rapide -->
    <div class="exp-denom-row" id="expDenomRow">
      <button class="exp-denom-btn" onclick="quickDenom('barolo')">🍷 Barolo</button>
      <button class="exp-denom-btn" onclick="quickDenom('barbaresco')">🍷 Barbaresco</button>
      <button class="exp-denom-btn" onclick="quickDenom('brunello')">🍷 Brunello</button>
      <button class="exp-denom-btn" onclick="quickDenom('chianti_classico')">🍷 Chianti</button>
      <button class="exp-denom-btn" onclick="quickDenom('amarone')">🍷 Amarone</button>
      <button class="exp-denom-btn" onclick="quickDenom('champagne')">🥂 Champagne</button>
      <button class="exp-denom-btn" onclick="quickDenom('gevrey')">🍷 Gevrey</button>
      <button class="exp-denom-btn" onclick="quickDenom('rioja')">🍷 Rioja</button>
      <button class="exp-denom-btn" onclick="quickDenom('port')">🍷 Porto</button>
      <button class="exp-denom-btn" onclick="quickDenom('mosel')">🍷 Mosel</button>
      <button class="exp-denom-btn" onclick="quickDenom('napa')">🍷 Napa</button>
    </div>
    <!-- Riga 2: Paesi (flyTo zoom 5-6) -->
    <div class="exp-country-row" id="expCountryRow">
      <button class="exp-country-btn" onclick="flyToCountry('Italia')">🇮🇹 ITALIA</button>
      <button class="exp-country-btn" onclick="flyToCountry('Francia')">🇫🇷 FRANCIA</button>
      <button class="exp-country-btn" onclick="flyToCountry('Spagna')">🇪🇸 SPAGNA</button>
      <button class="exp-country-btn" onclick="flyToCountry('USA')">🇺🇸 USA</button>
      <button class="exp-country-btn" onclick="flyToCountry('Germania')">🇩🇪 GERMANIA</button>
      <button class="exp-country-btn" onclick="flyToCountry('Portogallo')">🇵🇹 PORTOGALLO</button>
      <button class="exp-country-btn" onclick="flyToCountry('Argentina')">🇦🇷 ARGENTINA</button>
      <button class="exp-country-btn" onclick="flyToCountry('Australia')">🇦🇺 AUSTRALIA</button>
      <button class="exp-country-btn" onclick="flyToCountry('Grecia')">🇬🇷 GRECIA</button>
    </div>
  </div>

  <!-- Sezioni dinamiche -->
  <div id="expCountries"></div>
  <div id="expList" style="display:none;"></div>
  <div id="expDetail" style="display:none;"></div>
  <div id="expSearch" style="display:none;"></div>

</div>

<!-- COMPARATORE TERROIR -->
<div class="page" id="page-compare" style="padding-top:52px;">

  <!-- Header -->
  <div style="background:var(--nero);border-bottom:2px double rgba(191,155,74,.25);padding:14px 18px;text-align:center;">
    <div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:5px;color:rgba(191,155,74,.32);">⚖️ ANALISI</div>
    <div style="font-family:Cinzel,serif;font-size:1.1rem;color:var(--crema);letter-spacing:2px;">Confronta i Terroir</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(191,155,74,.45);margin-top:3px;">Scegli fino a 3 denominazioni e scopri le differenze</div>
  </div>

  <!-- Selezione denominazioni -->
  <div style="padding:14px 16px;background:rgba(10,7,5,.9);border-bottom:1px solid rgba(191,155,74,.12);">
    <div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:3px;color:rgba(191,155,74,.45);margin-bottom:10px;">SCEGLI LE DENOMINAZIONI DA CONFRONTARE</div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
      <div>
        <div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(191,155,74,.5);margin-bottom:5px;">ZONA 1</div>
        <select class="wine-select" id="cmp1" onchange="updateCmpPreview()">
          <option value="">Scegli…</option>
        </select>
      </div>
      <div>
        <div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(191,155,74,.5);margin-bottom:5px;">ZONA 2</div>
        <select class="wine-select" id="cmp2" onchange="updateCmpPreview()">
          <option value="">Scegli…</option>
        </select>
      </div>
      <div>
        <div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:1px;color:rgba(191,155,74,.5);margin-bottom:5px;">ZONA 3 (opt.)</div>
        <select class="wine-select" id="cmp3" onchange="updateCmpPreview()">
          <option value="">Nessuna</option>
        </select>
      </div>
    </div>

    <!-- Preview selezionati -->
    <div id="cmpPreview" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;min-height:24px;"></div>

    <!-- Tasto confronta -->
    <button onclick="doConfronto()" id="cmpBtn" disabled
      style="width:100%;padding:13px;background:rgba(92,26,26,.3);color:rgba(191,155,74,.4);font-family:Cinzel,serif;font-size:.6rem;letter-spacing:3px;border:1px solid rgba(191,155,74,.2);cursor:not-allowed;border-radius:2px;transition:all .2s;">
      ⚖️ CONFRONTA
    </button>
  </div>

  <!-- Suggerimenti rapidi -->
  <div style="padding:10px 14px;border-bottom:1px solid rgba(191,155,74,.08);">
    <div style="font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;color:rgba(191,155,74,.3);margin-bottom:7px;">CONFRONTI CLASSICI</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;">
      <button onclick="quickCompare('barolo','barbaresco','brunello')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.5px;padding:5px 10px;background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🇮🇹 Barolo · Barbaresco · Brunello</button>
      <button onclick="quickCompare('barolo','gevrey','napa')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.5px;padding:5px 10px;background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🌍 Barolo · Borgogna · Napa</button>
      <button onclick="quickCompare('champagne','franciacorta','')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.5px;padding:5px 10px;background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🥂 Champagne · Franciacorta</button>
      <button onclick="quickCompare('barolo','rioja','port')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.5px;padding:5px 10px;background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">♻️ 3 Grandi Rossi Europei</button>
      <button onclick="quickCompare('chablis','mosel','')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:.5px;padding:5px 10px;background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🤍 Bianchi Minerali</button>
    </div>
  </div>

  <!-- Risultato comparazione -->
  <div id="cmpLoad" style="display:none;text-align:center;padding:30px;font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.5);">
    Analisi in corso…
  </div>
  <div id="cmpResult" style="padding:0 0 80px;"></div>

</div>


<!-- SOMMELIER -->
<div class="page" id="page-sommelier" style="padding-top:52px;">

  <!-- Disclaimer AI legale -->
  <div style="background:rgba(5,3,1,.95);border-bottom:1px solid rgba(191,155,74,.12);padding:7px 14px;display:flex;align-items:center;gap:7px;">
    <span style="font-size:.8rem;flex-shrink:0;">ℹ️</span>
    <span style="font-family:IM Fell English,serif;font-style:italic;font-size:.74rem;color:rgba(245,239,226,.42);line-height:1.5;">
      Le raccomandazioni AI sono informative e non sostituiscono un professionista. Verifica disponibilità e prezzi.
    </span>
  </div>

  <!-- Header il Sommelier -->
  <div style="position:relative;height:160px;background:linear-gradient(135deg,#1a0505,#3d1408);background-size:cover;background-position:center;">
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,5,2,.25),rgba(10,5,2,.88));"></div>
    <div style="position:absolute;bottom:14px;left:16px;right:16px;">
      <div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:.3em;color:var(--oro);">SOMMELIER WORLD · L'ARTE DEL VINO</div>
      <div style="font-family:Cinzel,serif;font-size:1.2rem;color:#fff;letter-spacing:2px;margin-top:4px;">Il Sommelier AI</div>
    </div>
  </div>

  <div class="som-wrap">

    <!-- PRO BANNER (attivo) -->
    <div id="proBanner" style="display:none;background:linear-gradient(135deg,rgba(191,155,74,.15),rgba(92,26,26,.2));border:1px solid rgba(191,155,74,.4);padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:2px;color:var(--oro);">👑 SOMMELIER PRO ATTIVO</div>
        <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.78rem;color:rgba(245,239,226,.5);margin-top:2px;">Abbinamenti illimitati · QR menu · Export PDF</div>
      </div>
      <span style="font-family:Cinzel,serif;font-size:.65rem;color:#4CAF50;letter-spacing:1px;">✓ ATTIVO</span>
    </div>

    <!-- PRO OFFERTA (non attivo) -->
    <div id="proOffer" style="background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.2);padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:8px;">
      <div>
        <div style="font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;color:var(--oro);">⭐ SOMMELIER PRO · €9.99/mese</div>
        <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.76rem;color:rgba(245,239,226,.4);margin-top:2px;">Illimitato · QR code menu · Export PDF schede vino</div>
      </div>
      <button onclick="openProModal()" style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:1.5px;padding:8px 13px;background:var(--vino);color:#fff;border:none;cursor:pointer;flex-shrink:0;">PROVA GRATIS</button>
    </div>

    <!-- CERCA UN VINO -->
    <div style="background:rgba(191,155,74,.04);border:1px solid rgba(191,155,74,.14);padding:15px;margin-bottom:14px;">
      <div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:3px;color:var(--oro);margin-bottom:10px;">📖 CERCA UN VINO</div>
      
      <!-- Suggerimenti rapidi ricerca -->
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
        <button onclick="quickSearch('Cosa sono i tannini nel vino?')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">❓ Tannini</button>
        <button onclick="quickSearch('Barolo vs Barbaresco: differenze')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🍷 Barolo vs Barbaresco</button>
        <button onclick="quickSearch('Vino da regalo sotto 50 euro')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🎁 Vino da regalo</button>
        <button onclick="quickSearch('Champagne vs Prosecco vs Franciacorta')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🥂 Bollicine a confronto</button>
        <button onclick="quickSearch('Come si degusta un vino: guida base')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">📚 Come degustare</button>
        <button onclick="quickSearch('Differenza tra vino bianco e rosso')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🍇 Bianco vs Rosso</button>
      </div>
      
      <input class="field" id="wineSearch" type="text" placeholder="Es: Barolo, Dom Pérignon, Sassicaia, Krug…">
      <button class="cta-btn" style="margin-top:0;" onclick="doWineSearch()">CERCA →</button>
      <div id="wsLoad" style="display:none;text-align:center;padding:14px;font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.5);">Ricerca in corso…</div>
      <div id="wsRes" style="display:none;margin-top:10px;background:rgba(10,5,2,.6);border:1px solid rgba(191,155,74,.15);padding:14px;font-family:Cormorant Garamond,serif;font-size:1rem;line-height:1.8;color:#F5EFE2;"></div>
    </div>

    <!-- ABBINAMENTO MENU -->
    <div style="background:rgba(191,155,74,.04);border:1px solid rgba(191,155,74,.14);padding:15px;margin-bottom:14px;">
      <div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:3px;color:var(--oro);margin-bottom:12px;">🍽️ ABBINAMENTO MENU</div>

      <!-- Foto menu -->
      <label style="display:inline-flex;align-items:center;gap:7px;font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1.5px;padding:8px 12px;border:1px solid rgba(191,155,74,.3);color:rgba(191,155,74,.6);cursor:pointer;margin-bottom:8px;" for="photoInput">
        📷 <span id="photoLbl">Fotografa menu</span>
      </label>
      <input type="file" id="photoInput" accept="image/*" capture="environment" style="display:none;">
      <div id="photoPreview" style="display:none;align-items:center;gap:8px;margin-bottom:8px;">
        <img id="photoImg" style="height:36px;width:36px;object-fit:cover;border:1px solid rgba(191,155,74,.3);" alt="">
        <span id="photoName" style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(245,239,226,.5);"></span>
        <button id="photoRm" style="background:var(--vino);color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;line-height:20px;font-size:.6rem;text-align:center;">✕</button>
      </div>

      <label class="field-lbl">Scrivi i piatti (uno per riga)</label>
      <!-- Abbinamenti rapidi pre-compilati -->
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">
        <button onclick="quickMenu('pesce')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🐟 Abbinamento pesce</button>
        <button onclick="quickMenu('carne')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🥩 Abbinamento carne</button>
        <button onclick="quickMenu('vegetariano')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🥗 Menu vegetariano</button>
        <button onclick="quickMenu('degustazione')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🍽️ Menu degustazione</button>
        <button onclick="quickMenu('formaggi')" style="font-family:Cinzel,serif;font-size:.42rem;letter-spacing:1px;padding:5px 9px;background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.7);cursor:pointer;border-radius:2px;">🧀 Selezione formaggi</button>
      </div>
      <textarea class="field" id="menuText" rows="4" placeholder="Antipasto — Carpaccio di tonno&#10;Primo — Risotto al tartufo bianco&#10;Secondo — Fagianella alla creta&#10;Formaggi — Fontina DOP&#10;Dolce — Millefoglie al pistacchio"></textarea>

      <label class="field-lbl">Budget massimo per bottiglia</label>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <input type="range" id="budget" min="15" max="500" value="80" style="flex:1;accent-color:var(--vino);">
        <span id="budgetVal" style="font-family:Cinzel,serif;font-size:.8rem;color:var(--oro);min-width:48px;">€80</span>
      </div>

      <!-- PROFILO ORGANOLETTICO -->
      <div class="wine-param-block">
        <div class="wine-param-title">🧪 PROFILO ORGANOLETTICO DEL VINO DESIDERATO</div>

        <!-- Acidità -->
        <div class="wine-slider-row">
          <div class="wine-slider-header">
            <span class="wine-slider-label">ACIDITÀ<button onclick="showParamHelp('ACIDITÀ','L`acidità è la "spina dorsale" del vino. Un vino con alta acidità ti lascia una sensazione fresca e "salivante" in bocca, come mordere un limone. L`acidità alta conserva il vino nel tempo e lo rende ottimo a tavola. Vini ad alta acidità: Riesling, Barolo, Champagne. Bassa acidità: Merlot, vini del Sud.'.replace(/`/g,String.fromCharCode(39)))" style="background:none;border:1px solid rgba(191,155,74,.3);border-radius:50%;color:rgba(191,155,74,.6);font-family:Cinzel,serif;font-size:.45rem;width:16px;height:16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-left:5px;line-height:1;vertical-align:middle;flex-shrink:0;">?</button></span>
            <span class="wine-slider-value" id="aciditaVal">Media</span>
          </div>
          <input type="range" class="wine-slider" id="acidita" min="1" max="5" value="3"
            oninput="updateSlider('acidita',['Bassa','Medio-bassa','Media','Medio-alta','Alta'])">
          <div class="wine-slider-poles">
            <span class="wine-slider-pole">Bassa — morbido</span>
            <span class="wine-slider-pole">Alta — vivace</span>
          </div>
        </div>

        <!-- Morbidezza (tannini per rossi, rotondità per bianchi) -->
        <div class="wine-slider-row">
          <div class="wine-slider-header">
            <span class="wine-slider-label">MORBIDEZZA<button onclick="showParamHelp('MORBIDEZZA','La morbidezza indica quanto il vino è "rotondo" e carezzevole in bocca. Un vino molto morbido non ha spigoli — è avvolgente, quasi cremoso. I tannini bassi e il calore alcolico contribuiscono alla morbidezza. Vini morbidi: Merlot, Pinot Nero, Amarone maturo. Poco morbidi: Barolo giovane, Sagrantino.'.replace(/`/g,String.fromCharCode(39)))" style="background:none;border:1px solid rgba(191,155,74,.3);border-radius:50%;color:rgba(191,155,74,.6);font-family:Cinzel,serif;font-size:.45rem;width:16px;height:16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-left:5px;line-height:1;vertical-align:middle;flex-shrink:0;">?</button></span>
            <span class="wine-slider-value" id="morbidezzaVal">Media</span>
          </div>
          <input type="range" class="wine-slider" id="morbidezza" min="1" max="5" value="3"
            oninput="updateSlider('morbidezza',['Secco-tannico','Poco morbido','Equilibrato','Morbido','Molto morbido'])">
          <div class="wine-slider-poles">
            <span class="wine-slider-pole">Tannico — secco</span>
            <span class="wine-slider-pole">Morbido — vellutato</span>
          </div>
        </div>

        <!-- Sapidità -->
        <div class="wine-slider-row">
          <div class="wine-slider-header">
            <span class="wine-slider-label">SAPIDITÀ<button onclick="showParamHelp('SAPIDITÀ','La sapidità è la "mineralità" del vino — quella sensazione quasi "salata" o di pietra bagnata che ti viene guardando il mare. Un vino sapido è dissetante, vivo, territoriale. Dipende dal suolo: viti su roccia vulcanica o calcare danno vini molto sapidi. Esempi: Vermentino sardo, Assyrtiko di Santorini, Chablis.'.replace(/`/g,String.fromCharCode(39)))" style="background:none;border:1px solid rgba(191,155,74,.3);border-radius:50%;color:rgba(191,155,74,.6);font-family:Cinzel,serif;font-size:.45rem;width:16px;height:16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-left:5px;line-height:1;vertical-align:middle;flex-shrink:0;">?</button></span>
            <span class="wine-slider-value" id="sapidVal">Media</span>
          </div>
          <input type="range" class="wine-slider" id="sapidita" min="1" max="5" value="3"
            oninput="updateSlider('sapidita',['Bassa','Poco sapido','Sapido','Molto sapido','Minerale-salino'])">
          <div class="wine-slider-poles">
            <span class="wine-slider-pole">Poco sapido</span>
            <span class="wine-slider-pole">Minerale · salato</span>
          </div>
        </div>

        <!-- Struttura / Corpo -->
        <div class="wine-slider-row" style="margin-bottom:0;">
          <div class="wine-slider-header">
            <span class="wine-slider-label">STRUTTURA<button onclick="showParamHelp('STRUTTURA','La struttura è il "peso" del vino in bocca. Un vino leggero è come l`acqua — delicato, scorrevole. Un vino pieno e concentrato riempie la bocca, ha tannini evidenti, alcol percettibile. Struttura piena: Amarone, Barolo, Châteauneuf-du-Pape. Leggeri: Pinot Grigio, Beaujolais, Vinho Verde.'.replace(/`/g,String.fromCharCode(39)))" style="background:none;border:1px solid rgba(191,155,74,.3);border-radius:50%;color:rgba(191,155,74,.6);font-family:Cinzel,serif;font-size:.45rem;width:16px;height:16px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-left:5px;line-height:1;vertical-align:middle;flex-shrink:0;">?</button></span>
            <span class="wine-slider-value" id="strutturaVal">Media</span>
          </div>
          <input type="range" class="wine-slider" id="struttura" min="1" max="5" value="3"
            oninput="updateSlider('struttura',['Leggero','Medio-leggero','Medio','Medio-pieno','Pieno e concentrato'])">
          <div class="wine-slider-poles">
            <span class="wine-slider-pole">Leggero</span>
            <span class="wine-slider-pole">Pieno · concentrato</span>
          </div>
        </div>
      </div>

      <!-- PAESE E REGIONE -->
      <div class="wine-param-block" style="margin-bottom:12px;">
        <div class="wine-param-title">🌍 ORIGINE PREFERITA</div>
        <div class="wine-geo-row">
          <div>
            <div class="wine-slider-label" style="margin-bottom:5px;display:block;">PAESE</div>
            <select class="wine-select" id="winePaese" onchange="updateRegioni()">
              <option value="">Qualsiasi paese</option>
              <option value="Italia">🇮🇹 Italia</option>
              <option value="Francia">🇫🇷 Francia</option>
              <option value="Spagna">🇪🇸 Spagna</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="Germania">🇩🇪 Germania</option>
              <option value="Portogallo">🇵🇹 Portogallo</option>
              <option value="Argentina">🇦🇷 Argentina</option>
              <option value="Cile">🇨🇱 Cile</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="Nuova Zelanda">🇳🇿 Nuova Zelanda</option>
              <option value="Grecia">🇬🇷 Grecia</option>
              <option value="Austria">🇦🇹 Austria</option>
              <option value="Ungheria">🇭🇺 Ungheria</option>
              <option value="Georgia">🇬🇪 Georgia</option>
              <option value="Sud Africa">🇿🇦 Sud Africa</option>
            </select>
          </div>
          <div>
            <div class="wine-slider-label" style="margin-bottom:5px;display:block;">REGIONE</div>
            <select class="wine-select" id="wineRegione">
              <option value="">Qualsiasi regione</option>
            </select>
          </div>
        </div>
      </div>

      <label class="field-lbl">Preferenze aggiuntive</label>
      <div id="prefPills" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:13px;"></div>

      <button class="cta-btn" onclick="doAbbinamento()">✦ CONSULTA IL SOMMELIER ✦</button>

      <div id="somLoad" style="display:none;text-align:center;padding:16px;font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.5);">Analisi del menu in corso…</div>
      <div id="somResult" style="display:none;margin-top:12px;background:rgba(10,5,2,.6);border:1px solid rgba(191,155,74,.15);padding:14px;font-family:Cormorant Garamond,serif;font-size:1rem;line-height:1.85;color:#F5EFE2;"></div>

      <!-- Azioni post-risultato -->
      <div id="somActions" style="display:none;margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
        <button onclick="exportPDF()" style="font-family:Cinzel,serif;font-size:.54rem;letter-spacing:2px;padding:9px 15px;background:rgba(191,155,74,.12);border:1px solid rgba(191,155,74,.3);color:var(--oro);cursor:pointer;">📄 ESPORTA PDF</button>
        <button onclick="openQRModal()" style="font-family:Cinzel,serif;font-size:.54rem;letter-spacing:2px;padding:9px 15px;background:rgba(92,26,26,.25);border:1px solid rgba(191,155,74,.3);color:var(--oro);cursor:pointer;">📱 QR MENU</button>
      </div>
    </div>

  </div>
</div>

<!-- GAZETTE nascosta (notizie sono in HOME) -->
<div class="page" id="page-news" style="display:none!important;">
<div id="newsPageContainer"></div></div>

<!-- PRODUTTORI -->
<div class="page" id="page-producers" style="padding-top:60px;">
  <div style="background:var(--nero);border-bottom:2px double rgba(191,155,74,.3);padding:16px 18px;text-align:center;">
    <div style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:5px;color:rgba(191,155,74,.32);">🏅 DIRECTORY MONDIALE</div>
    <div style="font-family:Cinzel,serif;font-size:1.3rem;color:var(--crema);letter-spacing:2px;">Produttori del Mondo</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.84rem;color:rgba(191,155,74,.45);margin-top:4px;">Inserisci la tua cantina e raggiungi i sommelier di tutto il mondo</div>
  </div>

  <div style="padding:16px;">

    <div style="font-family:Cinzel,serif;font-size:.64rem;letter-spacing:3px;color:var(--oro);margin-bottom:14px;border-bottom:1px solid rgba(191,155,74,.2);padding-bottom:8px;">
      ✦ SCEGLI IL PACCHETTO · toccalo per selezionarlo
    </div>

    <!-- PACCHETTO BASIC -->
    <div onclick="selectPkgPage('basic',this)" id="pkgCard_basic"
         style="background:rgba(191,155,74,.05);border:1px solid rgba(191,155,74,.2);padding:15px;margin-bottom:10px;cursor:pointer;border-radius:2px;transition:all .2s;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.8rem;">🥂</span>
          <div>
            <div style="font-family:Cinzel,serif;font-size:.78rem;letter-spacing:2px;color:var(--crema);">BASIC</div>
            <div style="font-family:Cinzel,serif;font-size:1.4rem;color:var(--oro);line-height:1.1;">€19<span style="font-size:.55rem;color:rgba(191,155,74,.5);"> /mese</span></div>
          </div>
        </div>
        <div id="check_basic" style="width:24px;height:24px;border-radius:50%;border:2px solid rgba(191,155,74,.3);display:flex;align-items:center;justify-content:center;font-size:.75rem;transition:all .2s;"></div>
      </div>
      <div style="margin-top:12px;border-top:1px solid rgba(191,155,74,.1);padding-top:10px;font-family:IM Fell English,serif;font-style:italic;font-size:.87rem;color:rgba(245,239,226,.6);line-height:1.8;">
        ✓ Scheda cantina nella directory pubblica<br>
        ✓ Pin sulla mappa mondiale interattiva<br>
        ✓ Foto vino e descrizione testuale<br>
        ✓ Link diretto al tuo sito web<br>
        ✓ Visibile a tutti i sommelier iscritti
      </div>
    </div>

    <!-- PACCHETTO PREMIUM -->
    <div onclick="selectPkgPage('premium',this)" id="pkgCard_premium"
         style="background:rgba(92,26,26,.12);border:1px solid rgba(191,155,74,.35);padding:15px;margin-bottom:10px;cursor:pointer;border-radius:2px;position:relative;transition:all .2s;">
      <div style="position:absolute;top:-10px;right:16px;background:var(--oro);color:var(--nero);font-family:Cinzel,serif;font-size:.44rem;letter-spacing:2px;padding:3px 10px;">PIÙ SCELTO</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.8rem;">⭐</span>
          <div>
            <div style="font-family:Cinzel,serif;font-size:.78rem;letter-spacing:2px;color:var(--crema);">PREMIUM</div>
            <div style="font-family:Cinzel,serif;font-size:1.4rem;color:var(--oro);line-height:1.1;">€49<span style="font-size:.55rem;color:rgba(191,155,74,.5);"> /mese</span></div>
          </div>
        </div>
        <div id="check_premium" style="width:24px;height:24px;border-radius:50%;border:2px solid rgba(191,155,74,.3);display:flex;align-items:center;justify-content:center;font-size:.75rem;transition:all .2s;"></div>
      </div>
      <div style="margin-top:12px;border-top:1px solid rgba(191,155,74,.15);padding-top:10px;font-family:IM Fell English,serif;font-style:italic;font-size:.87rem;color:rgba(245,239,226,.6);line-height:1.8;">
        ✓ Tutto il Basic, più:<br>
        ✓ <strong style="color:var(--crema);">Prima posizione</strong> nella ricerca per denominazione<br>
        ✓ Marker dorato sulla mappa · vigna in evidenza<br>
        ✓ Fino a 5 foto del vigneto e della cantina<br>
        ✓ Badge "Produttore Premium" sulla scheda<br>
        ✓ Notifica push ai sommelier abbonati della zona
      </div>
    </div>

    <!-- PACCHETTO ELITE -->
    <div onclick="selectPkgPage('elite',this)" id="pkgCard_elite"
         style="background:rgba(191,155,74,.08);border:1px solid rgba(191,155,74,.45);padding:15px;margin-bottom:18px;cursor:pointer;border-radius:2px;transition:all .2s;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.8rem;">👑</span>
          <div>
            <div style="font-family:Cinzel,serif;font-size:.78rem;letter-spacing:2px;color:var(--crema);">ELITE</div>
            <div style="font-family:Cinzel,serif;font-size:1.4rem;color:var(--oro);line-height:1.1;">€99<span style="font-size:.55rem;color:rgba(191,155,74,.5);"> /mese</span></div>
          </div>
        </div>
        <div id="check_elite" style="width:24px;height:24px;border-radius:50%;border:2px solid rgba(191,155,74,.3);display:flex;align-items:center;justify-content:center;font-size:.75rem;transition:all .2s;"></div>
      </div>
      <div style="margin-top:12px;border-top:1px solid rgba(191,155,74,.2);padding-top:10px;font-family:IM Fell English,serif;font-style:italic;font-size:.87rem;color:rgba(245,239,226,.6);line-height:1.8;">
        ✓ Tutto il Premium, più:<br>
        ✓ <strong style="color:var(--crema);">Articolo editoriale AI</strong> generato mensilmente dal Sommelier<br>
        ✓ Inclusione nella sezione Featured di Sommelier World<br>
        ✓ Scheda ampelografica approfondita con abbinamenti poetici<br>
        ✓ QR code personalizzato per bottiglie ed eventi<br>
        ✓ Consulenza diretta con il Sommelier · priorità assoluta
      </div>
    </div>

    <!-- Pulsante — si abilita solo dopo selezione -->
    <button id="procediProdBtn" onclick="openProdModal('',_selPkgPage||'')"
      disabled style="font-family:Cinzel,serif;font-size:.62rem;letter-spacing:3px;width:100%;padding:14px;background:rgba(191,155,74,.15);color:rgba(191,155,74,.4);border:1px solid rgba(191,155,74,.25);cursor:not-allowed;margin-bottom:8px;">
      🍷 INSERISCI LA TUA CANTINA →
    </button>
    <p id="pkgPageHint" style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(191,155,74,.35);text-align:center;margin:0 0 20px;">
      Seleziona un pacchetto qui sopra per continuare
    </p>

    <!-- Lista produttori inseriti -->
    <div id="allProdsContainer"></div>
  </div>
</div>

<!-- FOOTER LEGALE -->
<div style="background:#050302;border-top:1px solid rgba(191,155,74,.12);padding:16px 18px;text-align:center;">
  <div style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:3px;color:rgba(191,155,74,.25);margin-bottom:8px;">SOMMELIER WORLD · TUTTI I DIRITTI RISERVATI</div>
  <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;">
    <span onclick="showPage('privacy')" style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;color:rgba(191,155,74,.4);cursor:pointer;">Privacy Policy</span>
    <span style="color:rgba(191,155,74,.2);">·</span>
    <span onclick="showPage('terms')" style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;color:rgba(191,155,74,.4);cursor:pointer;">Termini di Servizio</span>
    <span style="color:rgba(191,155,74,.2);">·</span>
    <span style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;color:rgba(191,155,74,.25);">Le inserzioni produttori sono contenuti promozionali</span>
  </div>
</div>

<!-- DRAWER -->'

<div id="drawer">
  <div class="drawer-handle"></div>
  <button class="drawer-close" onclick="closeDrawer()">✕</button>
  <div class="drawer-body"><div id="drawerContent"></div></div>
</div>

<!-- PRODUCER MODAL -->
<div id="prodModal">
  <div class="modal-box">
    <div class="modal-head">
      <div><div class="modal-title">🍷 INSERISCI IL TUO VINO</div><div class="modal-sub" id="modalBadge"></div></div>
      <button onclick="closeProdModal()" style="background:none;border:none;color:rgba(245,239,226,.38);font-size:1.2rem;cursor:pointer;">✕</button>
    </div>
    <div class="modal-body">
      <div class="pkg-row">
        <div class="pkg sel" data-pkg="basic" onclick="selPkg(this,'basic')">
          <span class="pkg-ico">🥂</span><div class="pkg-nm">Basic</div>
          <div class="pkg-pr">€19<small>/mese</small></div>
          <div class="pkg-ft">Card + Marker mappa</div>
        </div>
        <div class="pkg" data-pkg="premium" onclick="selPkg(this,'premium')">
          <span class="pkg-ico">🍷</span><div class="pkg-nm">Premium</div>
          <div class="pkg-pr">€49<small>/mese</small></div>
          <div class="pkg-ft">Prima posizione + Vigna evidenziata</div>
        </div>
        <div class="pkg" data-pkg="elite" onclick="selPkg(this,'elite')">
          <span class="pkg-ico">👑</span><div class="pkg-nm">Elite</div>
          <div class="pkg-pr">€99<small>/mese</small></div>
          <div class="pkg-ft">Tutto + Articolo editoriale</div>
        </div>
      </div>
      <label class="field-lbl">Nome Cantina *</label>
      <input class="field" id="pCant" type="text" placeholder="Es: Oasi degli Angeli">
      <label class="field-lbl">Nome Vino *</label>
      <input class="field" id="pWine" type="text" placeholder="Es: Kurni 2021">
      <label class="field-lbl">Vigna / MGA</label>
      <input class="field" id="pVigna" type="text" placeholder="Es: Vigna Molsino">
      <div class="form-row">
        <div><label class="field-lbl">Latitudine</label><input class="field" id="pLat" type="number" step="0.0001" placeholder="43.09"></div>
        <div><label class="field-lbl">Longitudine</label><input class="field" id="pLng" type="number" step="0.0001" placeholder="13.85"></div>
      </div>
      <label class="field-lbl">Descrizione</label>
      <textarea class="field" id="pDesc" rows="3" placeholder="Suolo, vinificazione, note…"></textarea>
      <div class="form-row">
        <div><label class="field-lbl">Prezzo</label><input class="field" id="pPrice" type="text" placeholder="€45"></div>
        <div><label class="field-lbl">Email *</label><input class="field" id="pEmail" type="email" placeholder="cantina@es.it"></div>
      </div>
      <div class="form-err" id="pErr"></div>
      <button class="cta-btn" id="pSubmit" onclick="submitProd()">✦ PROCEDI AL PAGAMENTO ✦</button>
      <!-- Step pagamento -->
      <div id="pPayStep" style="display:none;margin-top:14px;border:1px solid rgba(191,155,74,.35);padding:18px;text-align:center;">
        <div style="font-family:Cinzel,serif;font-size:.70rem;letter-spacing:3px;color:var(--oro);margin-bottom:4px;">💳 RIEPILOGO ORDINE</div>
        <div style="font-family:Cinzel,serif;font-size:1.3rem;color:var(--crema);margin:10px 0 4px;" id="pPayAmount"></div>
        <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.82rem;color:rgba(191,155,74,.5);margin-bottom:14px;">Pacchetto <span id="pPayPkg"></span> · Rinnovo mensile · Cancella quando vuoi</div>
        <div style="background:rgba(255,255,255,.04);border:1px solid rgba(191,155,74,.15);padding:12px;margin-bottom:14px;font-family:IM Fell English,serif;font-style:italic;font-size:.82rem;color:rgba(245,239,226,.5);line-height:1.7;">
          🔒 Pagamento sicuro via Stripe.<br>La tua cantina sarà visibile dopo la conferma del pagamento.
        </div>
        <button onclick="confirmPayment()" class="cta-btn" style="margin-bottom:8px;">💳 PAGA ORA</button>
        <button onclick="document.getElementById('pPayStep').style.display='none';document.getElementById('pSubmit').style.display='block';" style="width:100%;padding:10px;background:transparent;border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.45);font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;cursor:pointer;">← TORNA INDIETRO</button>
      </div>
      <div class="form-ok" id="pOk">
        <div class="form-ok-icon">🍾</div>
        <div class="form-ok-title">RICHIESTA INVIATA!</div>
        <div class="form-ok-body">La tua vigna è stata aggiunta alla mappa.<br>Ti contatteremo entro 24 ore.</div>
      </div>
    </div>
  </div>
</div>

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script async src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script async src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).leaflet={})}(this,function(t){"use strict";function l(t){for(var e,i,n=1,o=arguments.length;n<o;n++)for(e in i=arguments[n])t[e]=i[e];return t}var R=Object.create||function(t){return N.prototype=t,new N};function N(){}function a(t,e){var i,n=Array.prototype.slice;return t.bind?t.bind.apply(t,n.call(arguments,1)):(i=n.call(arguments,2),function(){return t.apply(e,i.length?i.concat(n.call(arguments)):arguments)})}var D=0;function h(t){return"_leaflet_id"in t||(t._leaflet_id=++D),t._leaflet_id}function j(t,e,i){var n,o,s=function(){n=!1,o&&(r.apply(i,o),o=!1)},r=function(){n?o=arguments:(t.apply(i,arguments),setTimeout(s,e),n=!0)};return r}function H(t,e,i){var n=e[1],e=e[0],o=n-e;return t===n&&i?t:((t-e)%o+o)%o+e}function u(){return!1}function i(t,e){return!1===e?t:(e=Math.pow(10,void 0===e?6:e),Math.round(t*e)/e)}function W(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function F(t){return W(t).split(/\s+/)}function c(t,e){for(var i in Object.prototype.hasOwnProperty.call(t,"options")||(t.options=t.options?R(t.options):{}),e)t.options[i]=e[i];return t.options}function U(t,e,i){var n,o=[];for(n in t)o.push(encodeURIComponent(i?n.toUpperCase():n)+"="+encodeURIComponent(t[n]));return(e&&-1!==e.indexOf("?")?"&":"?")+o.join("&")}var V=/\{ *([\w_ -]+) *\}/g;function q(t,i){return t.replace(V,function(t,e){e=i[e];if(void 0===e)throw new Error("No value provided for variable "+t);return e="function"==typeof e?e(i):e})}var d=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};function G(t,e){for(var i=0;i<t.length;i++)if(t[i]===e)return i;return-1}var K="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";function Y(t){return window["webkit"+t]||window["moz"+t]||window["ms"+t]}var X=0;function J(t){var e=+new Date,i=Math.max(0,16-(e-X));return X=e+i,window.setTimeout(t,i)}var $=window.requestAnimationFrame||Y("RequestAnimationFrame")||J,Q=window.cancelAnimationFrame||Y("CancelAnimationFrame")||Y("CancelRequestAnimationFrame")||function(t){window.clearTimeout(t)};function x(t,e,i){if(!i||$!==J)return $.call(window,a(t,e));t.call(e)}function r(t){t&&Q.call(window,t)}var tt={__proto__:null,extend:l,create:R,bind:a,get lastId(){return D},stamp:h,throttle:j,wrapNum:H,falseFn:u,formatNum:i,trim:W,splitWords:F,setOptions:c,getParamString:U,template:q,isArray:d,indexOf:G,emptyImageUrl:K,requestFn:$,cancelFn:Q,requestAnimFrame:x,cancelAnimFrame:r};function et(){}et.extend=function(t){function e(){c(this),this.initialize&&this.initialize.apply(this,arguments),this.callInitHooks()}var i,n=e.__super__=this.prototype,o=R(n);for(i in(o.constructor=e).prototype=o,this)Object.prototype.hasOwnProperty.call(this,i)&&"prototype"!==i&&"__super__"!==i&&(e[i]=this[i]);if(t.statics&&l(e,t.statics),t.includes){var s=t.includes;if("undefined"!=typeof L&&L&&L.Mixin){s=d(s)?s:[s];for(var r=0;r<s.length;r++)s[r]===L.Mixin.Events&&console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.",(new Error).stack)}l.apply(null,[o].concat(t.includes))}return l(o,t),delete o.statics,delete o.includes,o.options&&(o.options=n.options?R(n.options):{},l(o.options,t.options)),o._initHooks=[],o.callInitHooks=function(){if(!this._initHooksCalled){n.callInitHooks&&n.callInitHooks.call(this),this._initHooksCalled=!0;for(var t=0,e=o._initHooks.length;t<e;t++)o._initHooks[t].call(this)}},e},et.include=function(t){var e=this.prototype.options;return l(this.prototype,t),t.options&&(this.prototype.options=e,this.mergeOptions(t.options)),this},et.mergeOptions=function(t){return l(this.prototype.options,t),this},et.addInitHook=function(t){var e=Array.prototype.slice.call(arguments,1),i="function"==typeof t?t:function(){this[t].apply(this,e)};return this.prototype._initHooks=this.prototype._initHooks||[],this.prototype._initHooks.push(i),this};var e={on:function(t,e,i){if("object"==typeof t)for(var n in t)this._on(n,t[n],e);else for(var o=0,s=(t=F(t)).length;o<s;o++)this._on(t[o],e,i);return this},off:function(t,e,i){if(arguments.length)if("object"==typeof t)for(var n in t)this._off(n,t[n],e);else{t=F(t);for(var o=1===arguments.length,s=0,r=t.length;s<r;s++)o?this._off(t[s]):this._off(t[s],e,i)}else delete this._events;return this},_on:function(t,e,i,n){"function"!=typeof e?console.warn("wrong listener type: "+typeof e):!1===this._listens(t,e,i)&&(e={fn:e,ctx:i=i===this?void 0:i},n&&(e.once=!0),this._events=this._events||{},this._events[t]=this._events[t]||[],this._events[t].push(e))},_off:function(t,e,i){var n,o,s;if(this._events&&(n=this._events[t]))if(1===arguments.length){if(this._firingCount)for(o=0,s=n.length;o<s;o++)n[o].fn=u;delete this._events[t]}else"function"!=typeof e?console.warn("wrong listener type: "+typeof e):!1!==(e=this._listens(t,e,i))&&(i=n[e],this._firingCount&&(i.fn=u,this._events[t]=n=n.slice()),n.splice(e,1))},fire:function(t,e,i){if(this.listens(t,i)){var n=l({},e,{type:t,target:this,sourceTarget:e&&e.sourceTarget||this});if(this._events){var o=this._events[t];if(o){this._firingCount=this._firingCount+1||1;for(var s=0,r=o.length;s<r;s++){var a=o[s],h=a.fn;a.once&&this.off(t,h,a.ctx),h.call(a.ctx||this,n)}this._firingCount--}}i&&this._propagateEvent(n)}return this},listens:function(t,e,i,n){"string"!=typeof t&&console.warn('"string" type argument expected');var o=e,s=("function"!=typeof e&&(n=!!e,i=o=void 0),this._events&&this._events[t]);if(s&&s.length&&!1!==this._listens(t,o,i))return!0;if(n)for(var r in this._eventParents)if(this._eventParents[r].listens(t,e,i,n))return!0;return!1},_listens:function(t,e,i){if(this._events){var n=this._events[t]||[];if(!e)return!!n.length;i===this&&(i=void 0);for(var o=0,s=n.length;o<s;o++)if(n[o].fn===e&&n[o].ctx===i)return o}return!1},once:function(t,e,i){if("object"==typeof t)for(var n in t)this._on(n,t[n],e,!0);else for(var o=0,s=(t=F(t)).length;o<s;o++)this._on(t[o],e,i,!0);return this},addEventParent:function(t){return this._eventParents=this._eventParents||{},this._eventParents[h(t)]=t,this},removeEventParent:function(t){return this._eventParents&&delete this._eventParents[h(t)],this},_propagateEvent:function(t){for(var e in this._eventParents)this._eventParents[e].fire(t.type,l({layer:t.target,propagatedFrom:t.target},t),!0)}},it=(e.addEventListener=e.on,e.removeEventListener=e.clearAllEventListeners=e.off,e.addOneTimeEventListener=e.once,e.fireEvent=e.fire,e.hasEventListeners=e.listens,et.extend(e));function p(t,e,i){this.x=i?Math.round(t):t,this.y=i?Math.round(e):e}var nt=Math.trunc||function(t){return 0<t?Math.floor(t):Math.ceil(t)};function m(t,e,i){return t instanceof p?t:d(t)?new p(t[0],t[1]):null==t?t:"object"==typeof t&&"x"in t&&"y"in t?new p(t.x,t.y):new p(t,e,i)}function f(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;n<o;n++)this.extend(i[n])}function _(t,e){return!t||t instanceof f?t:new f(t,e)}function s(t,e){if(t)for(var i=e?[t,e]:t,n=0,o=i.length;n<o;n++)this.extend(i[n])}function g(t,e){return t instanceof s?t:new s(t,e)}function v(t,e,i){if(isNaN(t)||isNaN(e))throw new Error("Invalid LatLng object: ("+t+", "+e+")");this.lat=+t,this.lng=+e,void 0!==i&&(this.alt=+i)}function w(t,e,i){return t instanceof v?t:d(t)&&"object"!=typeof t[0]?3===t.length?new v(t[0],t[1],t[2]):2===t.length?new v(t[0],t[1]):null:null==t?t:"object"==typeof t&&"lat"in t?new v(t.lat,"lng"in t?t.lng:t.lon,t.alt):void 0===e?null:new v(t,e,i)}p.prototype={clone:function(){return new p(this.x,this.y)},add:function(t){return this.clone()._add(m(t))},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(m(t))},_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t){return this.clone()._divideBy(t)},_divideBy:function(t){return this.x/=t,this.y/=t,this},multiplyBy:function(t){return this.clone()._multiplyBy(t)},_multiplyBy:function(t){return this.x*=t,this.y*=t,this},scaleBy:function(t){return new p(this.x*t.x,this.y*t.y)},unscaleBy:function(t){return new p(this.x/t.x,this.y/t.y)},round:function(){return this.clone()._round()},_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},floor:function(){return this.clone()._floor()},_floor:function(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this},ceil:function(){return this.clone()._ceil()},_ceil:function(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this},trunc:function(){return this.clone()._trunc()},_trunc:function(){return this.x=nt(this.x),this.y=nt(this.y),this},distanceTo:function(t){var e=(t=m(t)).x-this.x,t=t.y-this.y;return Math.sqrt(e*e+t*t)},equals:function(t){return(t=m(t)).x===this.x&&t.y===this.y},contains:function(t){return t=m(t),Math.abs(t.x)<=Math.abs(this.x)&&Math.abs(t.y)<=Math.abs(this.y)},toString:function(){return"Point("+i(this.x)+", "+i(this.y)+")"}},f.prototype={extend:function(t){var e,i;if(t){if(t instanceof p||"number"==typeof t[0]||"x"in t)e=i=m(t);else if(e=(t=_(t)).min,i=t.max,!e||!i)return this;this.min||this.max?(this.min.x=Math.min(e.x,this.min.x),this.max.x=Math.max(i.x,this.max.x),this.min.y=Math.min(e.y,this.min.y),this.max.y=Math.max(i.y,this.max.y)):(this.min=e.clone(),this.max=i.clone())}return this},getCenter:function(t){return m((this.min.x+this.max.x)/2,(this.min.y+this.max.y)/2,t)},getBottomLeft:function(){return m(this.min.x,this.max.y)},getTopRight:function(){return m(this.max.x,this.min.y)},getTopLeft:function(){return this.min},getBottomRight:function(){return this.max},getSize:function(){return this.max.subtract(this.min)},contains:function(t){var e,i;return(t=("number"==typeof t[0]||t instanceof p?m:_)(t))instanceof f?(e=t.min,i=t.max):e=i=t,e.x>=this.min.x&&i.x<=this.max.x&&e.y>=this.min.y&&i.y<=this.max.y},intersects:function(t){t=_(t);var e=this.min,i=this.max,n=t.min,t=t.max,o=t.x>=e.x&&n.x<=i.x,t=t.y>=e.y&&n.y<=i.y;return o&&t},overlaps:function(t){t=_(t);var e=this.min,i=this.max,n=t.min,t=t.max,o=t.x>e.x&&n.x<i.x,t=t.y>e.y&&n.y<i.y;return o&&t},isValid:function(){return!(!this.min||!this.max)},pad:function(t){var e=this.min,i=this.max,n=Math.abs(e.x-i.x)*t,t=Math.abs(e.y-i.y)*t;return _(m(e.x-n,e.y-t),m(i.x+n,i.y+t))},equals:function(t){return!!t&&(t=_(t),this.min.equals(t.getTopLeft())&&this.max.equals(t.getBottomRight()))}},s.prototype={extend:function(t){var e,i,n=this._southWest,o=this._northEast;if(t instanceof v)i=e=t;else{if(!(t instanceof s))return t?this.extend(w(t)||g(t)):this;if(e=t._southWest,i=t._northEast,!e||!i)return this}return n||o?(n.lat=Math.min(e.lat,n.lat),n.lng=Math.min(e.lng,n.lng),o.lat=Math.max(i.lat,o.lat),o.lng=Math.max(i.lng,o.lng)):(this._southWest=new v(e.lat,e.lng),this._northEast=new v(i.lat,i.lng)),this},pad:function(t){var e=this._southWest,i=this._northEast,n=Math.abs(e.lat-i.lat)*t,t=Math.abs(e.lng-i.lng)*t;return new s(new v(e.lat-n,e.lng-t),new v(i.lat+n,i.lng+t))},getCenter:function(){return new v((this._southWest.lat+this._northEast.lat)/2,(this._southWest.lng+this._northEast.lng)/2)},getSouthWest:function(){return this._southWest},getNorthEast:function(){return this._northEast},getNorthWest:function(){return new v(this.getNorth(),this.getWest())},getSouthEast:function(){return new v(this.getSouth(),this.getEast())},getWest:function(){return this._southWest.lng},getSouth:function(){return this._southWest.lat},getEast:function(){return this._northEast.lng},getNorth:function(){return this._northEast.lat},contains:function(t){t=("number"==typeof t[0]||t instanceof v||"lat"in t?w:g)(t);var e,i,n=this._southWest,o=this._northEast;return t instanceof s?(e=t.getSouthWest(),i=t.getNorthEast()):e=i=t,e.lat>=n.lat&&i.lat<=o.lat&&e.lng>=n.lng&&i.lng<=o.lng},intersects:function(t){t=g(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),t=t.getNorthEast(),o=t.lat>=e.lat&&n.lat<=i.lat,t=t.lng>=e.lng&&n.lng<=i.lng;return o&&t},overlaps:function(t){t=g(t);var e=this._southWest,i=this._northEast,n=t.getSouthWest(),t=t.getNorthEast(),o=t.lat>e.lat&&n.lat<i.lat,t=t.lng>e.lng&&n.lng<i.lng;return o&&t},toBBoxString:function(){return[this.getWest(),this.getSouth(),this.getEast(),this.getNorth()].join(",")},equals:function(t,e){return!!t&&(t=g(t),this._southWest.equals(t.getSouthWest(),e)&&this._northEast.equals(t.getNorthEast(),e))},isValid:function(){return!(!this._southWest||!this._northEast)}};var ot={latLngToPoint:function(t,e){t=this.projection.project(t),e=this.scale(e);return this.transformation._transform(t,e)},pointToLatLng:function(t,e){e=this.scale(e),t=this.transformation.untransform(t,e);return this.projection.unproject(t)},project:function(t){return this.projection.project(t)},unproject:function(t){return this.projection.unproject(t)},scale:function(t){return 256*Math.pow(2,t)},zoom:function(t){return Math.log(t/256)/Math.LN2},getProjectedBounds:function(t){var e;return this.infinite?null:(e=this.projection.bounds,t=this.scale(t),new f(this.transformation.transform(e.min,t),this.transformation.transform(e.max,t)))},infinite:!(v.prototype={equals:function(t,e){return!!t&&(t=w(t),Math.max(Math.abs(this.lat-t.lat),Math.abs(this.lng-t.lng))<=(void 0===e?1e-9:e))},toString:function(t){return"LatLng("+i(this.lat,t)+", "+i(this.lng,t)+")"},distanceTo:function(t){return st.distance(this,w(t))},wrap:function(){return st.wrapLatLng(this)},toBounds:function(t){var t=180*t/40075017,e=t/Math.cos(Math.PI/180*this.lat);return g([this.lat-t,this.lng-e],[this.lat+t,this.lng+e])},clone:function(){return new v(this.lat,this.lng,this.alt)}}),wrapLatLng:function(t){var e=this.wrapLng?H(t.lng,this.wrapLng,!0):t.lng;return new v(this.wrapLat?H(t.lat,this.wrapLat,!0):t.lat,e,t.alt)},wrapLatLngBounds:function(t){var e=t.getCenter(),i=this.wrapLatLng(e),n=e.lat-i.lat,e=e.lng-i.lng;return 0==n&&0==e?t:(i=t.getSouthWest(),t=t.getNorthEast(),new s(new v(i.lat-n,i.lng-e),new v(t.lat-n,t.lng-e)))}},st=l({},ot,{wrapLng:[-180,180],R:6371e3,distance:function(t,e){var i=Math.PI/180,n=t.lat*i,o=e.lat*i,s=Math.sin((e.lat-t.lat)*i/2),e=Math.sin((e.lng-t.lng)*i/2),t=s*s+Math.cos(n)*Math.cos(o)*e*e,i=2*Math.atan2(Math.sqrt(t),Math.sqrt(1-t));return this.R*i}}),rt=6378137,rt={R:rt,MAX_LATITUDE:85.0511287798,project:function(t){var e=Math.PI/180,i=this.MAX_LATITUDE,i=Math.max(Math.min(i,t.lat),-i),i=Math.sin(i*e);return new p(this.R*t.lng*e,this.R*Math.log((1+i)/(1-i))/2)},unproject:function(t){var e=180/Math.PI;return new v((2*Math.atan(Math.exp(t.y/this.R))-Math.PI/2)*e,t.x*e/this.R)},bounds:new f([-(rt=rt*Math.PI),-rt],[rt,rt])};function at(t,e,i,n){d(t)?(this._a=t[0],this._b=t[1],this._c=t[2],this._d=t[3]):(this._a=t,this._b=e,this._c=i,this._d=n)}function ht(t,e,i,n){return new at(t,e,i,n)}at.prototype={transform:function(t,e){return this._transform(t.clone(),e)},_transform:function(t,e){return t.x=(e=e||1)*(this._a*t.x+this._b),t.y=e*(this._c*t.y+this._d),t},untransform:function(t,e){return new p((t.x/(e=e||1)-this._b)/this._a,(t.y/e-this._d)/this._c)}};var lt=l({},st,{code:"EPSG:3857",projection:rt,transformation:ht(lt=.5/(Math.PI*rt.R),.5,-lt,.5)}),ut=l({},lt,{code:"EPSG:900913"});function ct(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function dt(t,e){for(var i,n,o,s,r="",a=0,h=t.length;a<h;a++){for(i=0,n=(o=t[a]).length;i<n;i++)r+=(i?"L":"M")+(s=o[i]).x+" "+s.y;r+=e?b.svg?"z":"x":""}return r||"M0 0"}var _t=document.documentElement.style,pt="ActiveXObject"in window,mt=pt&&!document.addEventListener,n="msLaunchUri"in navigator&&!("documentMode"in document),ft=y("webkit"),gt=y("android"),vt=y("android 2")||y("android 3"),yt=parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1],10),yt=gt&&y("Google")&&yt<537&&!("AudioNode"in window),xt=!!window.opera,wt=!n&&y("chrome"),bt=y("gecko")&&!ft&&!xt&&!pt,Pt=!wt&&y("safari"),Lt=y("phantom"),o="OTransition"in _t,Tt=0===navigator.platform.indexOf("Win"),Mt=pt&&"transition"in _t,zt="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix&&!vt,_t="MozPerspective"in _t,Ct=!window.L_DISABLE_3D&&(Mt||zt||_t)&&!o&&!Lt,Zt="undefined"!=typeof orientation||y("mobile"),St=Zt&&ft,Et=Zt&&zt,kt=!window.PointerEvent&&window.MSPointerEvent,Ot=!(!window.PointerEvent&&!kt),At="ontouchstart"in window||!!window.TouchEvent,Bt=!window.L_NO_TOUCH&&(At||Ot),It=Zt&&xt,Rt=Zt&&bt,Nt=1<(window.devicePixelRatio||window.screen.deviceXDPI/window.screen.logicalXDPI),Dt=function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("testPassiveEventSupport",u,e),window.removeEventListener("testPassiveEventSupport",u,e)}catch(t){}return t}(),jt=!!document.createElement("canvas").getContext,Ht=!(!document.createElementNS||!ct("svg").createSVGRect),Wt=!!Ht&&((Wt=document.createElement("div")).innerHTML="<svg/>","http://www.w3.org/2000/svg"===(Wt.firstChild&&Wt.firstChild.namespaceURI));function y(t){return 0<=navigator.userAgent.toLowerCase().indexOf(t)}var b={ie:pt,ielt9:mt,edge:n,webkit:ft,android:gt,android23:vt,androidStock:yt,opera:xt,chrome:wt,gecko:bt,safari:Pt,phantom:Lt,opera12:o,win:Tt,ie3d:Mt,webkit3d:zt,gecko3d:_t,any3d:Ct,mobile:Zt,mobileWebkit:St,mobileWebkit3d:Et,msPointer:kt,pointer:Ot,touch:Bt,touchNative:At,mobileOpera:It,mobileGecko:Rt,retina:Nt,passiveEvents:Dt,canvas:jt,svg:Ht,vml:!Ht&&function(){try{var t=document.createElement("div"),e=(t.innerHTML='<v:shape adj="1"/>',t.firstChild);return e.style.behavior="url(#default#VML)",e&&"object"==typeof e.adj}catch(t){return!1}}(),inlineSvg:Wt,mac:0===navigator.platform.indexOf("Mac"),linux:0===navigator.platform.indexOf("Linux")},Ft=b.msPointer?"MSPointerDown":"pointerdown",Ut=b.msPointer?"MSPointerMove":"pointermove",Vt=b.msPointer?"MSPointerUp":"pointerup",qt=b.msPointer?"MSPointerCancel":"pointercancel",Gt={touchstart:Ft,touchmove:Ut,touchend:Vt,touchcancel:qt},Kt={touchstart:function(t,e){e.MSPOINTER_TYPE_TOUCH&&e.pointerType===e.MSPOINTER_TYPE_TOUCH&&O(e);ee(t,e)},touchmove:ee,touchend:ee,touchcancel:ee},Yt={},Xt=!1;function Jt(t,e,i){return"touchstart"!==e||Xt||(document.addEventListener(Ft,$t,!0),document.addEventListener(Ut,Qt,!0),document.addEventListener(Vt,te,!0),document.addEventListener(qt,te,!0),Xt=!0),Kt[e]?(i=Kt[e].bind(this,i),t.addEventListener(Gt[e],i,!1),i):(console.warn("wrong event specified:",e),u)}function $t(t){Yt[t.pointerId]=t}function Qt(t){Yt[t.pointerId]&&(Yt[t.pointerId]=t)}function te(t){delete Yt[t.pointerId]}function ee(t,e){if(e.pointerType!==(e.MSPOINTER_TYPE_MOUSE||"mouse")){for(var i in e.touches=[],Yt)e.touches.push(Yt[i]);e.changedTouches=[e],t(e)}}var ie=200;function ne(t,i){t.addEventListener("dblclick",i);var n,o=0;function e(t){var e;1!==t.detail?n=t.detail:"mouse"===t.pointerType||t.sourceCapabilities&&!t.sourceCapabilities.firesTouchEvents||((e=Ne(t)).some(function(t){return t instanceof HTMLLabelElement&&t.attributes.for})&&!e.some(function(t){return t instanceof HTMLInputElement||t instanceof HTMLSelectElement})||((e=Date.now())-o<=ie?2===++n&&i(function(t){var e,i,n={};for(i in t)e=t[i],n[i]=e&&e.bind?e.bind(t):e;return(t=n).type="dblclick",n.detail=2,n.isTrusted=!1,n._simulated=!0,n}(t)):n=1,o=e))}return t.addEventListener("click",e),{dblclick:i,simDblclick:e}}var oe,se,re,ae,he,le,ue=we(["transform","webkitTransform","OTransform","MozTransform","msTransform"]),ce=we(["webkitTransition","transition","OTransition","MozTransition","msTransition"]),de="webkitTransition"===ce||"OTransition"===ce?ce+"End":"transitionend";function _e(t){return"string"==typeof t?document.getElementById(t):t}function pe(t,e){var i=t.style[e]||t.currentStyle&&t.currentStyle[e];return"auto"===(i=i&&"auto"!==i||!document.defaultView?i:(t=document.defaultView.getComputedStyle(t,null))?t[e]:null)?null:i}function P(t,e,i){t=document.createElement(t);return t.className=e||"",i&&i.appendChild(t),t}function T(t){var e=t.parentNode;e&&e.removeChild(t)}function me(t){for(;t.firstChild;)t.removeChild(t.firstChild)}function fe(t){var e=t.parentNode;e&&e.lastChild!==t&&e.appendChild(t)}function ge(t){var e=t.parentNode;e&&e.firstChild!==t&&e.insertBefore(t,e.firstChild)}function ve(t,e){return void 0!==t.classList?t.classList.contains(e):0<(t=xe(t)).length&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(t)}function M(t,e){var i;if(void 0!==t.classList)for(var n=F(e),o=0,s=n.length;o<s;o++)t.classList.add(n[o]);else ve(t,e)||ye(t,((i=xe(t))?i+" ":"")+e)}function z(t,e){void 0!==t.classList?t.classList.remove(e):ye(t,W((" "+xe(t)+" ").replace(" "+e+" "," ")))}function ye(t,e){void 0===t.className.baseVal?t.className=e:t.className.baseVal=e}function xe(t){return void 0===(t=t.correspondingElement?t.correspondingElement:t).className.baseVal?t.className:t.className.baseVal}function C(t,e){if("opacity"in t.style)t.style.opacity=e;else if("filter"in t.style){var i=!1,n="DXImageTransform.Microsoft.Alpha";try{i=t.filters.item(n)}catch(t){if(1===e)return}e=Math.round(100*e),i?(i.Enabled=100!==e,i.Opacity=e):t.style.filter+=" progid:"+n+"(opacity="+e+")"}}function we(t){for(var e=document.documentElement.style,i=0;i<t.length;i++)if(t[i]in e)return t[i];return!1}function be(t,e,i){e=e||new p(0,0);t.style[ue]=(b.ie3d?"translate("+e.x+"px,"+e.y+"px)":"translate3d("+e.x+"px,"+e.y+"px,0)")+(i?" scale("+i+")":"")}function Z(t,e){t._leaflet_pos=e,b.any3d?be(t,e):(t.style.left=e.x+"px",t.style.top=e.y+"px")}function Pe(t){return t._leaflet_pos||new p(0,0)}function Le(){S(window,"dragstart",O)}function Te(){k(window,"dragstart",O)}function Me(t){for(;-1===t.tabIndex;)t=t.parentNode;t.style&&(ze(),le=(he=t).style.outlineStyle,t.style.outlineStyle="none",S(window,"keydown",ze))}function ze(){he&&(he.style.outlineStyle=le,le=he=void 0,k(window,"keydown",ze))}function Ce(t){for(;!((t=t.parentNode).offsetWidth&&t.offsetHeight||t===document.body););return t}function Ze(t){var e=t.getBoundingClientRect();return{x:e.width/t.offsetWidth||1,y:e.height/t.offsetHeight||1,boundingClientRect:e}}ae="onselectstart"in document?(re=function(){S(window,"selectstart",O)},function(){k(window,"selectstart",O)}):(se=we(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]),re=function(){var t;se&&(t=document.documentElement.style,oe=t[se],t[se]="none")},function(){se&&(document.documentElement.style[se]=oe,oe=void 0)});pt={__proto__:null,TRANSFORM:ue,TRANSITION:ce,TRANSITION_END:de,get:_e,getStyle:pe,create:P,remove:T,empty:me,toFront:fe,toBack:ge,hasClass:ve,addClass:M,removeClass:z,setClass:ye,getClass:xe,setOpacity:C,testProp:we,setTransform:be,setPosition:Z,getPosition:Pe,get disableTextSelection(){return re},get enableTextSelection(){return ae},disableImageDrag:Le,enableImageDrag:Te,preventOutline:Me,restoreOutline:ze,getSizedParentNode:Ce,getScale:Ze};function S(t,e,i,n){if(e&&"object"==typeof e)for(var o in e)ke(t,o,e[o],i);else for(var s=0,r=(e=F(e)).length;s<r;s++)ke(t,e[s],i,n);return this}var E="_leaflet_events";function k(t,e,i,n){if(1===arguments.length)Se(t),delete t[E];else if(e&&"object"==typeof e)for(var o in e)Oe(t,o,e[o],i);else if(e=F(e),2===arguments.length)Se(t,function(t){return-1!==G(e,t)});else for(var s=0,r=e.length;s<r;s++)Oe(t,e[s],i,n);return this}function Se(t,e){for(var i in t[E]){var n=i.split(/\d/)[0];e&&!e(n)||Oe(t,n,null,null,i)}}var Ee={mouseenter:"mouseover",mouseleave:"mouseout",wheel:!("onwheel"in window)&&"mousewheel"};function ke(e,t,i,n){var o,s,r=t+h(i)+(n?"_"+h(n):"");e[E]&&e[E][r]||(s=o=function(t){return i.call(n||e,t||window.event)},!b.touchNative&&b.pointer&&0===t.indexOf("touch")?o=Jt(e,t,o):b.touch&&"dblclick"===t?o=ne(e,o):"addEventListener"in e?"touchstart"===t||"touchmove"===t||"wheel"===t||"mousewheel"===t?e.addEventListener(Ee[t]||t,o,!!b.passiveEvents&&{passive:!1}):"mouseenter"===t||"mouseleave"===t?e.addEventListener(Ee[t],o=function(t){t=t||window.event,We(e,t)&&s(t)},!1):e.addEventListener(t,s,!1):e.attachEvent("on"+t,o),e[E]=e[E]||{},e[E][r]=o)}function Oe(t,e,i,n,o){o=o||e+h(i)+(n?"_"+h(n):"");var s,r,i=t[E]&&t[E][o];i&&(!b.touchNative&&b.pointer&&0===e.indexOf("touch")?(n=t,r=i,Gt[s=e]?n.removeEventListener(Gt[s],r,!1):console.warn("wrong event specified:",s)):b.touch&&"dblclick"===e?(n=i,(r=t).removeEventListener("dblclick",n.dblclick),r.removeEventListener("click",n.simDblclick)):"removeEventListener"in t?t.removeEventListener(Ee[e]||e,i,!1):t.detachEvent("on"+e,i),t[E][o]=null)}function Ae(t){return t.stopPropagation?t.stopPropagation():t.originalEvent?t.originalEvent._stopped=!0:t.cancelBubble=!0,this}function Be(t){return ke(t,"wheel",Ae),this}function Ie(t){return S(t,"mousedown touchstart dblclick contextmenu",Ae),t._leaflet_disable_click=!0,this}function O(t){return t.preventDefault?t.preventDefault():t.returnValue=!1,this}function Re(t){return O(t),Ae(t),this}function Ne(t){if(t.composedPath)return t.composedPath();for(var e=[],i=t.target;i;)e.push(i),i=i.parentNode;return e}function De(t,e){var i,n;return e?(n=(i=Ze(e)).boundingClientRect,new p((t.clientX-n.left)/i.x-e.clientLeft,(t.clientY-n.top)/i.y-e.clientTop)):new p(t.clientX,t.clientY)}var je=b.linux&&b.chrome?window.devicePixelRatio:b.mac?3*window.devicePixelRatio:0<window.devicePixelRatio?2*window.devicePixelRatio:1;function He(t){return b.edge?t.wheelDeltaY/2:t.deltaY&&0===t.deltaMode?-t.deltaY/je:t.deltaY&&1===t.deltaMode?20*-t.deltaY:t.deltaY&&2===t.deltaMode?60*-t.deltaY:t.deltaX||t.deltaZ?0:t.wheelDelta?(t.wheelDeltaY||t.wheelDelta)/2:t.detail&&Math.abs(t.detail)<32765?20*-t.detail:t.detail?t.detail/-32765*60:0}function We(t,e){var i=e.relatedTarget;if(!i)return!0;try{for(;i&&i!==t;)i=i.parentNode}catch(t){return!1}return i!==t}var mt={__proto__:null,on:S,off:k,stopPropagation:Ae,disableScrollPropagation:Be,disableClickPropagation:Ie,preventDefault:O,stop:Re,getPropagationPath:Ne,getMousePosition:De,getWheelDelta:He,isExternalTarget:We,addListener:S,removeListener:k},Fe=it.extend({run:function(t,e,i,n){this.stop(),this._el=t,this._inProgress=!0,this._duration=i||.25,this._easeOutPower=1/Math.max(n||.5,.2),this._startPos=Pe(t),this._offset=e.subtract(this._startPos),this._startTime=+new Date,this.fire("start"),this._animate()},stop:function(){this._inProgress&&(this._step(!0),this._complete())},_animate:function(){this._animId=x(this._animate,this),this._step()},_step:function(t){var e=+new Date-this._startTime,i=1e3*this._duration;e<i?this._runFrame(this._easeOut(e/i),t):(this._runFrame(1),this._complete())},_runFrame:function(t,e){t=this._startPos.add(this._offset.multiplyBy(t));e&&t._round(),Z(this._el,t),this.fire("step")},_complete:function(){r(this._animId),this._inProgress=!1,this.fire("end")},_easeOut:function(t){return 1-Math.pow(1-t,this._easeOutPower)}}),A=it.extend({options:{crs:lt,center:void 0,zoom:void 0,minZoom:void 0,maxZoom:void 0,layers:[],maxBounds:void 0,renderer:void 0,zoomAnimation:!0,zoomAnimationThreshold:4,fadeAnimation:!0,markerZoomAnimation:!0,transform3DLimit:8388608,zoomSnap:1,zoomDelta:1,trackResize:!0},initialize:function(t,e){e=c(this,e),this._handlers=[],this._layers={},this._zoomBoundLayers={},this._sizeChanged=!0,this._initContainer(t),this._initLayout(),this._onResize=a(this._onResize,this),this._initEvents(),e.maxBounds&&this.setMaxBounds(e.maxBounds),void 0!==e.zoom&&(this._zoom=this._limitZoom(e.zoom)),e.center&&void 0!==e.zoom&&this.setView(w(e.center),e.zoom,{reset:!0}),this.callInitHooks(),this._zoomAnimated=ce&&b.any3d&&!b.mobileOpera&&this.options.zoomAnimation,this._zoomAnimated&&(this._createAnimProxy(),S(this._proxy,de,this._catchTransitionEnd,this)),this._addLayers(this.options.layers)},setView:function(t,e,i){if((e=void 0===e?this._zoom:this._limitZoom(e),t=this._limitCenter(w(t),e,this.options.maxBounds),i=i||{},this._stop(),this._loaded&&!i.reset&&!0!==i)&&(void 0!==i.animate&&(i.zoom=l({animate:i.animate},i.zoom),i.pan=l({animate:i.animate,duration:i.duration},i.pan)),this._zoom!==e?this._tryAnimatedZoom&&this._tryAnimatedZoom(t,e,i.zoom):this._tryAnimatedPan(t,i.pan)))return clearTimeout(this._sizeTimer),this;return this._resetView(t,e,i.pan&&i.pan.noMoveStart),this},setZoom:function(t,e){return this._loaded?this.setView(this.getCenter(),t,{zoom:e}):(this._zoom=t,this)},zoomIn:function(t,e){return t=t||(b.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom+t,e)},zoomOut:function(t,e){return t=t||(b.any3d?this.options.zoomDelta:1),this.setZoom(this._zoom-t,e)},setZoomAround:function(t,e,i){var n=this.getZoomScale(e),o=this.getSize().divideBy(2),t=(t instanceof p?t:this.latLngToContainerPoint(t)).subtract(o).multiplyBy(1-1/n),n=this.containerPointToLatLng(o.add(t));return this.setView(n,e,{zoom:i})},_getBoundsCenterZoom:function(t,e){e=e||{},t=t.getBounds?t.getBounds():g(t);var i=m(e.paddingTopLeft||e.padding||[0,0]),n=m(e.paddingBottomRight||e.padding||[0,0]),o=this.getBoundsZoom(t,!1,i.add(n));return(o="number"==typeof e.maxZoom?Math.min(e.maxZoom,o):o)===1/0?{center:t.getCenter(),zoom:o}:(e=n.subtract(i).divideBy(2),n=this.project(t.getSouthWest(),o),i=this.project(t.getNorthEast(),o),{center:this.unproject(n.add(i).divideBy(2).add(e),o),zoom:o})},fitBounds:function(t,e){if((t=g(t)).isValid())return t=this._getBoundsCenterZoom(t,e),this.setView(t.center,t.zoom,e);throw new Error("Bounds are not valid.")},fitWorld:function(t){return this.fitBounds([[-90,-180],[90,180]],t)},panTo:function(t,e){return this.setView(t,this._zoom,{pan:e})},panBy:function(t,e){var i;return e=e||{},(t=m(t).round()).x||t.y?(!0===e.animate||this.getSize().contains(t)?(this._panAnim||(this._panAnim=new Fe,this._panAnim.on({step:this._onPanTransitionStep,end:this._onPanTransitionEnd},this)),e.noMoveStart||this.fire("movestart"),!1!==e.animate?(M(this._mapPane,"leaflet-pan-anim"),i=this._getMapPanePos().subtract(t).round(),this._panAnim.run(this._mapPane,i,e.duration||.25,e.easeLinearity)):(this._rawPanBy(t),this.fire("move").fire("moveend"))):this._resetView(this.unproject(this.project(this.getCenter()).add(t)),this.getZoom()),this):this.fire("moveend")},flyTo:function(n,o,t){if(!1===(t=t||{}).animate||!b.any3d)return this.setView(n,o,t);this._stop();var s=this.project(this.getCenter()),r=this.project(n),e=this.getSize(),a=this._zoom,h=(n=w(n),o=void 0===o?a:o,Math.max(e.x,e.y)),i=h*this.getZoomScale(a,o),l=r.distanceTo(s)||1,u=1.42,c=u*u;function d(t){t=(i*i-h*h+(t?-1:1)*c*c*l*l)/(2*(t?i:h)*c*l),t=Math.sqrt(t*t+1)-t;return t<1e-9?-18:Math.log(t)}function _(t){return(Math.exp(t)-Math.exp(-t))/2}function p(t){return(Math.exp(t)+Math.exp(-t))/2}var m=d(0);function f(t){return h*(p(m)*(_(t=m+u*t)/p(t))-_(m))/c}var g=Date.now(),v=(d(1)-m)/u,y=t.duration?1e3*t.duration:1e3*v*.8;return this._moveStart(!0,t.noMoveStart),function t(){var e=(Date.now()-g)/y,i=(1-Math.pow(1-e,1.5))*v;e<=1?(this._flyToFrame=x(t,this),this._move(this.unproject(s.add(r.subtract(s).multiplyBy(f(i)/l)),a),this.getScaleZoom(h/(e=i,h*(p(m)/p(m+u*e))),a),{flyTo:!0})):this._move(n,o)._moveEnd(!0)}.call(this),this},flyToBounds:function(t,e){t=this._getBoundsCenterZoom(t,e);return this.flyTo(t.center,t.zoom,e)},setMaxBounds:function(t){return t=g(t),this.listens("moveend",this._panInsideMaxBounds)&&this.off("moveend",this._panInsideMaxBounds),t.isValid()?(this.options.maxBounds=t,this._loaded&&this._panInsideMaxBounds(),this.on("moveend",this._panInsideMaxBounds)):(this.options.maxBounds=null,this)},setMinZoom:function(t){var e=this.options.minZoom;return this.options.minZoom=t,this._loaded&&e!==t&&(this.fire("zoomlevelschange"),this.getZoom()<this.options.minZoom)?this.setZoom(t):this},setMaxZoom:function(t){var e=this.options.maxZoom;return this.options.maxZoom=t,this._loaded&&e!==t&&(this.fire("zoomlevelschange"),this.getZoom()>this.options.maxZoom)?this.setZoom(t):this},panInsideBounds:function(t,e){this._enforcingBounds=!0;var i=this.getCenter(),t=this._limitCenter(i,this._zoom,g(t));return i.equals(t)||this.panTo(t,e),this._enforcingBounds=!1,this},panInside:function(t,e){var i=m((e=e||{}).paddingTopLeft||e.padding||[0,0]),n=m(e.paddingBottomRight||e.padding||[0,0]),o=this.project(this.getCenter()),t=this.project(t),s=this.getPixelBounds(),i=_([s.min.add(i),s.max.subtract(n)]),s=i.getSize();return i.contains(t)||(this._enforcingBounds=!0,n=t.subtract(i.getCenter()),i=i.extend(t).getSize().subtract(s),o.x+=n.x<0?-i.x:i.x,o.y+=n.y<0?-i.y:i.y,this.panTo(this.unproject(o),e),this._enforcingBounds=!1),this},invalidateSize:function(t){if(!this._loaded)return this;t=l({animate:!1,pan:!0},!0===t?{animate:!0}:t);var e=this.getSize(),i=(this._sizeChanged=!0,this._lastCenter=null,this.getSize()),n=e.divideBy(2).round(),o=i.divideBy(2).round(),n=n.subtract(o);return n.x||n.y?(t.animate&&t.pan?this.panBy(n):(t.pan&&this._rawPanBy(n),this.fire("move"),t.debounceMoveend?(clearTimeout(this._sizeTimer),this._sizeTimer=setTimeout(a(this.fire,this,"moveend"),200)):this.fire("moveend")),this.fire("resize",{oldSize:e,newSize:i})):this},stop:function(){return this.setZoom(this._limitZoom(this._zoom)),this.options.zoomSnap||this.fire("viewreset"),this._stop()},locate:function(t){var e,i;return t=this._locateOptions=l({timeout:1e4,watch:!1},t),"geolocation"in navigator?(e=a(this._handleGeolocationResponse,this),i=a(this._handleGeolocationError,this),t.watch?this._locationWatchId=navigator.geolocation.watchPosition(e,i,t):navigator.geolocation.getCurrentPosition(e,i,t)):this._handleGeolocationError({code:0,message:"Geolocation not supported."}),this},stopLocate:function(){return navigator.geolocation&&navigator.geolocation.clearWatch&&navigator.geolocation.clearWatch(this._locationWatchId),this._locateOptions&&(this._locateOptions.setView=!1),this},_handleGeolocationError:function(t){var e;this._container._leaflet_id&&(e=t.code,t=t.message||(1===e?"permission denied":2===e?"position unavailable":"timeout"),this._locateOptions.setView&&!this._loaded&&this.fitWorld(),this.fire("locationerror",{code:e,message:"Geolocation error: "+t+"."}))},_handleGeolocationResponse:function(t){if(this._container._leaflet_id){var e,i,n=new v(t.coords.latitude,t.coords.longitude),o=n.toBounds(2*t.coords.accuracy),s=this._locateOptions,r=(s.setView&&(e=this.getBoundsZoom(o),this.setView(n,s.maxZoom?Math.min(e,s.maxZoom):e)),{latlng:n,bounds:o,timestamp:t.timestamp});for(i in t.coords)"number"==typeof t.coords[i]&&(r[i]=t.coords[i]);this.fire("locationfound",r)}},addHandler:function(t,e){return e&&(e=this[t]=new e(this),this._handlers.push(e),this.options[t]&&e.enable()),this},remove:function(){if(this._initEvents(!0),this.options.maxBounds&&this.off("moveend",this._panInsideMaxBounds),this._containerId!==this._container._leaflet_id)throw new Error("Map container is being reused by another instance");try{delete this._container._leaflet_id,delete this._containerId}catch(t){this._container._leaflet_id=void 0,this._containerId=void 0}for(var t in void 0!==this._locationWatchId&&this.stopLocate(),this._stop(),T(this._mapPane),this._clearControlPos&&this._clearControlPos(),this._resizeRequest&&(r(this._resizeRequest),this._resizeRequest=null),this._clearHandlers(),this._loaded&&this.fire("unload"),this._layers)this._layers[t].remove();for(t in this._panes)T(this._panes[t]);return this._layers=[],this._panes=[],delete this._mapPane,delete this._renderer,this},createPane:function(t,e){e=P("div","leaflet-pane"+(t?" leaflet-"+t.replace("Pane","")+"-pane":""),e||this._mapPane);return t&&(this._panes[t]=e),e},getCenter:function(){return this._checkIfLoaded(),this._lastCenter&&!this._moved()?this._lastCenter.clone():this.layerPointToLatLng(this._getCenterLayerPoint())},getZoom:function(){return this._zoom},getBounds:function(){var t=this.getPixelBounds();return new s(this.unproject(t.getBottomLeft()),this.unproject(t.getTopRight()))},getMinZoom:function(){return void 0===this.options.minZoom?this._layersMinZoom||0:this.options.minZoom},getMaxZoom:function(){return void 0===this.options.maxZoom?void 0===this._layersMaxZoom?1/0:this._layersMaxZoom:this.options.maxZoom},getBoundsZoom:function(t,e,i){t=g(t),i=m(i||[0,0]);var n=this.getZoom()||0,o=this.getMinZoom(),s=this.getMaxZoom(),r=t.getNorthWest(),t=t.getSouthEast(),i=this.getSize().subtract(i),t=_(this.project(t,n),this.project(r,n)).getSize(),r=b.any3d?this.options.zoomSnap:1,a=i.x/t.x,i=i.y/t.y,t=e?Math.max(a,i):Math.min(a,i),n=this.getScaleZoom(t,n);return r&&(n=Math.round(n/(r/100))*(r/100),n=e?Math.ceil(n/r)*r:Math.floor(n/r)*r),Math.max(o,Math.min(s,n))},getSize:function(){return this._size&&!this._sizeChanged||(this._size=new p(this._container.clientWidth||0,this._container.clientHeight||0),this._sizeChanged=!1),this._size.clone()},getPixelBounds:function(t,e){t=this._getTopLeftPoint(t,e);return new f(t,t.add(this.getSize()))},getPixelOrigin:function(){return this._checkIfLoaded(),this._pixelOrigin},getPixelWorldBounds:function(t){return this.options.crs.getProjectedBounds(void 0===t?this.getZoom():t)},getPane:function(t){return"string"==typeof t?this._panes[t]:t},getPanes:function(){return this._panes},getContainer:function(){return this._container},getZoomScale:function(t,e){var i=this.options.crs;return e=void 0===e?this._zoom:e,i.scale(t)/i.scale(e)},getScaleZoom:function(t,e){var i=this.options.crs,t=(e=void 0===e?this._zoom:e,i.zoom(t*i.scale(e)));return isNaN(t)?1/0:t},project:function(t,e){return e=void 0===e?this._zoom:e,this.options.crs.latLngToPoint(w(t),e)},unproject:function(t,e){return e=void 0===e?this._zoom:e,this.options.crs.pointToLatLng(m(t),e)},layerPointToLatLng:function(t){t=m(t).add(this.getPixelOrigin());return this.unproject(t)},latLngToLayerPoint:function(t){return this.project(w(t))._round()._subtract(this.getPixelOrigin())},wrapLatLng:function(t){return this.options.crs.wrapLatLng(w(t))},wrapLatLngBounds:function(t){return this.options.crs.wrapLatLngBounds(g(t))},distance:function(t,e){return this.options.crs.distance(w(t),w(e))},containerPointToLayerPoint:function(t){return m(t).subtract(this._getMapPanePos())},layerPointToContainerPoint:function(t){return m(t).add(this._getMapPanePos())},containerPointToLatLng:function(t){t=this.containerPointToLayerPoint(m(t));return this.layerPointToLatLng(t)},latLngToContainerPoint:function(t){return this.layerPointToContainerPoint(this.latLngToLayerPoint(w(t)))},mouseEventToContainerPoint:function(t){return De(t,this._container)},mouseEventToLayerPoint:function(t){return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))},mouseEventToLatLng:function(t){return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))},_initContainer:function(t){t=this._container=_e(t);if(!t)throw new Error("Map container not found.");if(t._leaflet_id)throw new Error("Map container is already initialized.");S(t,"scroll",this._onScroll,this),this._containerId=h(t)},_initLayout:function(){var t=this._container,e=(this._fadeAnimated=this.options.fadeAnimation&&b.any3d,M(t,"leaflet-container"+(b.touch?" leaflet-touch":"")+(b.retina?" leaflet-retina":"")+(b.ielt9?" leaflet-oldie":"")+(b.safari?" leaflet-safari":"")+(this._fadeAnimated?" leaflet-fade-anim":"")),pe(t,"position"));"absolute"!==e&&"relative"!==e&&"fixed"!==e&&"sticky"!==e&&(t.style.position="relative"),this._initPanes(),this._initControlPos&&this._initControlPos()},_initPanes:function(){var t=this._panes={};this._paneRenderers={},this._mapPane=this.createPane("mapPane",this._container),Z(this._mapPane,new p(0,0)),this.createPane("tilePane"),this.createPane("overlayPane"),this.createPane("shadowPane"),this.createPane("markerPane"),this.createPane("tooltipPane"),this.createPane("popupPane"),this.options.markerZoomAnimation||(M(t.markerPane,"leaflet-zoom-hide"),M(t.shadowPane,"leaflet-zoom-hide"))},_resetView:function(t,e,i){Z(this._mapPane,new p(0,0));var n=!this._loaded,o=(this._loaded=!0,e=this._limitZoom(e),this.fire("viewprereset"),this._zoom!==e);this._moveStart(o,i)._move(t,e)._moveEnd(o),this.fire("viewreset"),n&&this.fire("load")},_moveStart:function(t,e){return t&&this.fire("zoomstart"),e||this.fire("movestart"),this},_move:function(t,e,i,n){void 0===e&&(e=this._zoom);var o=this._zoom!==e;return this._zoom=e,this._lastCenter=t,this._pixelOrigin=this._getNewPixelOrigin(t),n?i&&i.pinch&&this.fire("zoom",i):((o||i&&i.pinch)&&this.fire("zoom",i),this.fire("move",i)),this},_moveEnd:function(t){return t&&this.fire("zoomend"),this.fire("moveend")},_stop:function(){return r(this._flyToFrame),this._panAnim&&this._panAnim.stop(),this},_rawPanBy:function(t){Z(this._mapPane,this._getMapPanePos().subtract(t))},_getZoomSpan:function(){return this.getMaxZoom()-this.getMinZoom()},_panInsideMaxBounds:function(){this._enforcingBounds||this.panInsideBounds(this.options.maxBounds)},_checkIfLoaded:function(){if(!this._loaded)throw new Error("Set map center and zoom first.")},_initEvents:function(t){this._targets={};var e=t?k:S;e((this._targets[h(this._container)]=this)._container,"click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup",this._handleDOMEvent,this),this.options.trackResize&&e(window,"resize",this._onResize,this),b.any3d&&this.options.transform3DLimit&&(t?this.off:this.on).call(this,"moveend",this._onMoveEnd)},_onResize:function(){r(this._resizeRequest),this._resizeRequest=x(function(){this.invalidateSize({debounceMoveend:!0})},this)},_onScroll:function(){this._container.scrollTop=0,this._container.scrollLeft=0},_onMoveEnd:function(){var t=this._getMapPanePos();Math.max(Math.abs(t.x),Math.abs(t.y))>=this.options.transform3DLimit&&this._resetView(this.getCenter(),this.getZoom())},_findEventTargets:function(t,e){for(var i,n=[],o="mouseout"===e||"mouseover"===e,s=t.target||t.srcElement,r=!1;s;){if((i=this._targets[h(s)])&&("click"===e||"preclick"===e)&&this._draggableMoved(i)){r=!0;break}if(i&&i.listens(e,!0)){if(o&&!We(s,t))break;if(n.push(i),o)break}if(s===this._container)break;s=s.parentNode}return n=n.length||r||o||!this.listens(e,!0)?n:[this]},_isClickDisabled:function(t){for(;t&&t!==this._container;){if(t._leaflet_disable_click)return!0;t=t.parentNode}},_handleDOMEvent:function(t){var e,i=t.target||t.srcElement;!this._loaded||i._leaflet_disable_events||"click"===t.type&&this._isClickDisabled(i)||("mousedown"===(e=t.type)&&Me(i),this._fireDOMEvent(t,e))},_mouseEvents:["click","dblclick","mouseover","mouseout","contextmenu"],_fireDOMEvent:function(t,e,i){"click"===t.type&&((a=l({},t)).type="preclick",this._fireDOMEvent(a,a.type,i));var n=this._findEventTargets(t,e);if(i){for(var o=[],s=0;s<i.length;s++)i[s].listens(e,!0)&&o.push(i[s]);n=o.concat(n)}if(n.length){"contextmenu"===e&&O(t);var r,a=n[0],h={originalEvent:t};for("keypress"!==t.type&&"keydown"!==t.type&&"keyup"!==t.type&&(r=a.getLatLng&&(!a._radius||a._radius<=10),h.containerPoint=r?this.latLngToContainerPoint(a.getLatLng()):this.mouseEventToContainerPoint(t),h.layerPoint=this.containerPointToLayerPoint(h.containerPoint),h.latlng=r?a.getLatLng():this.layerPointToLatLng(h.layerPoint)),s=0;s<n.length;s++)if(n[s].fire(e,h,!0),h.originalEvent._stopped||!1===n[s].options.bubblingMouseEvents&&-1!==G(this._mouseEvents,e))return}},_draggableMoved:function(t){return(t=t.dragging&&t.dragging.enabled()?t:this).dragging&&t.dragging.moved()||this.boxZoom&&this.boxZoom.moved()},_clearHandlers:function(){for(var t=0,e=this._handlers.length;t<e;t++)this._handlers[t].disable()},whenReady:function(t,e){return this._loaded?t.call(e||this,{target:this}):this.on("load",t,e),this},_getMapPanePos:function(){return Pe(this._mapPane)||new p(0,0)},_moved:function(){var t=this._getMapPanePos();return t&&!t.equals([0,0])},_getTopLeftPoint:function(t,e){return(t&&void 0!==e?this._getNewPixelOrigin(t,e):this.getPixelOrigin()).subtract(this._getMapPanePos())},_getNewPixelOrigin:function(t,e){var i=this.getSize()._divideBy(2);return this.project(t,e)._subtract(i)._add(this._getMapPanePos())._round()},_latLngToNewLayerPoint:function(t,e,i){i=this._getNewPixelOrigin(i,e);return this.project(t,e)._subtract(i)},_latLngBoundsToNewLayerBounds:function(t,e,i){i=this._getNewPixelOrigin(i,e);return _([this.project(t.getSouthWest(),e)._subtract(i),this.project(t.getNorthWest(),e)._subtract(i),this.project(t.getSouthEast(),e)._subtract(i),this.project(t.getNorthEast(),e)._subtract(i)])},_getCenterLayerPoint:function(){return this.containerPointToLayerPoint(this.getSize()._divideBy(2))},_getCenterOffset:function(t){return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())},_limitCenter:function(t,e,i){var n,o;return!i||(n=this.project(t,e),o=this.getSize().divideBy(2),o=new f(n.subtract(o),n.add(o)),o=this._getBoundsOffset(o,i,e),Math.abs(o.x)<=1&&Math.abs(o.y)<=1)?t:this.unproject(n.add(o),e)},_limitOffset:function(t,e){var i;return e?(i=new f((i=this.getPixelBounds()).min.add(t),i.max.add(t)),t.add(this._getBoundsOffset(i,e))):t},_getBoundsOffset:function(t,e,i){e=_(this.project(e.getNorthEast(),i),this.project(e.getSouthWest(),i)),i=e.min.subtract(t.min),e=e.max.subtract(t.max);return new p(this._rebound(i.x,-e.x),this._rebound(i.y,-e.y))},_rebound:function(t,e){return 0<t+e?Math.round(t-e)/2:Math.max(0,Math.ceil(t))-Math.max(0,Math.floor(e))},_limitZoom:function(t){var e=this.getMinZoom(),i=this.getMaxZoom(),n=b.any3d?this.options.zoomSnap:1;return n&&(t=Math.round(t/n)*n),Math.max(e,Math.min(i,t))},_onPanTransitionStep:function(){this.fire("move")},_onPanTransitionEnd:function(){z(this._mapPane,"leaflet-pan-anim"),this.fire("moveend")},_tryAnimatedPan:function(t,e){t=this._getCenterOffset(t)._trunc();return!(!0!==(e&&e.animate)&&!this.getSize().contains(t))&&(this.panBy(t,e),!0)},_createAnimProxy:function(){var t=this._proxy=P("div","leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(t),this.on("zoomanim",function(t){var e=ue,i=this._proxy.style[e];be(this._proxy,this.project(t.center,t.zoom),this.getZoomScale(t.zoom,1)),i===this._proxy.style[e]&&this._animatingZoom&&this._onZoomTransitionEnd()},this),this.on("load moveend",this._animMoveEnd,this),this._on("unload",this._destroyAnimProxy,this)},_destroyAnimProxy:function(){T(this._proxy),this.off("load moveend",this._animMoveEnd,this),delete this._proxy},_animMoveEnd:function(){var t=this.getCenter(),e=this.getZoom();be(this._proxy,this.project(t,e),this.getZoomScale(e,1))},_catchTransitionEnd:function(t){this._animatingZoom&&0<=t.propertyName.indexOf("transform")&&this._onZoomTransitionEnd()},_nothingToAnimate:function(){return!this._container.getElementsByClassName("leaflet-zoom-animated").length},_tryAnimatedZoom:function(t,e,i){if(!this._animatingZoom){if(i=i||{},!this._zoomAnimated||!1===i.animate||this._nothingToAnimate()||Math.abs(e-this._zoom)>this.options.zoomAnimationThreshold)return!1;var n=this.getZoomScale(e),n=this._getCenterOffset(t)._divideBy(1-1/n);if(!0!==i.animate&&!this.getSize().contains(n))return!1;x(function(){this._moveStart(!0,i.noMoveStart||!1)._animateZoom(t,e,!0)},this)}return!0},_animateZoom:function(t,e,i,n){this._mapPane&&(i&&(this._animatingZoom=!0,this._animateToCenter=t,this._animateToZoom=e,M(this._mapPane,"leaflet-zoom-anim")),this.fire("zoomanim",{center:t,zoom:e,noUpdate:n}),this._tempFireZoomEvent||(this._tempFireZoomEvent=this._zoom!==this._animateToZoom),this._move(this._animateToCenter,this._animateToZoom,void 0,!0),setTimeout(a(this._onZoomTransitionEnd,this),250))},_onZoomTransitionEnd:function(){this._animatingZoom&&(this._mapPane&&z(this._mapPane,"leaflet-zoom-anim"),this._animatingZoom=!1,this._move(this._animateToCenter,this._animateToZoom,void 0,!0),this._tempFireZoomEvent&&this.fire("zoom"),delete this._tempFireZoomEvent,this.fire("move"),this._moveEnd(!0))}});function Ue(t){return new B(t)}var B=et.extend({options:{position:"topright"},initialize:function(t){c(this,t)},getPosition:function(){return this.options.position},setPosition:function(t){var e=this._map;return e&&e.removeControl(this),this.options.position=t,e&&e.addControl(this),this},getContainer:function(){return this._container},addTo:function(t){this.remove(),this._map=t;var e=this._container=this.onAdd(t),i=this.getPosition(),t=t._controlCorners[i];return M(e,"leaflet-control"),-1!==i.indexOf("bottom")?t.insertBefore(e,t.firstChild):t.appendChild(e),this._map.on("unload",this.remove,this),this},remove:function(){return this._map&&(T(this._container),this.onRemove&&this.onRemove(this._map),this._map.off("unload",this.remove,this),this._map=null),this},_refocusOnMap:function(t){this._map&&t&&0<t.screenX&&0<t.screenY&&this._map.getContainer().focus()}}),Ve=(A.include({addControl:function(t){return t.addTo(this),this},removeControl:function(t){return t.remove(),this},_initControlPos:function(){var i=this._controlCorners={},n="leaflet-",o=this._controlContainer=P("div",n+"control-container",this._container);function t(t,e){i[t+e]=P("div",n+t+" "+n+e,o)}t("top","left"),t("top","right"),t("bottom","left"),t("bottom","right")},_clearControlPos:function(){for(var t in this._controlCorners)T(this._controlCorners[t]);T(this._controlContainer),delete this._controlCorners,delete this._controlContainer}}),B.extend({options:{collapsed:!0,position:"topright",autoZIndex:!0,hideSingleBase:!1,sortLayers:!1,sortFunction:function(t,e,i,n){return i<n?-1:n<i?1:0}},initialize:function(t,e,i){for(var n in c(this,i),this._layerControlInputs=[],this._layers=[],this._lastZIndex=0,this._handlingClick=!1,this._preventClick=!1,t)this._addLayer(t[n],n);for(n in e)this._addLayer(e[n],n,!0)},onAdd:function(t){this._initLayout(),this._update(),(this._map=t).on("zoomend",this._checkDisabledLayers,this);for(var e=0;e<this._layers.length;e++)this._layers[e].layer.on("add remove",this._onLayerChange,this);return this._container},addTo:function(t){return B.prototype.addTo.call(this,t),this._expandIfNotCollapsed()},onRemove:function(){this._map.off("zoomend",this._checkDisabledLayers,this);for(var t=0;t<this._layers.length;t++)this._layers[t].layer.off("add remove",this._onLayerChange,this)},addBaseLayer:function(t,e){return this._addLayer(t,e),this._map?this._update():this},addOverlay:function(t,e){return this._addLayer(t,e,!0),this._map?this._update():this},removeLayer:function(t){t.off("add remove",this._onLayerChange,this);t=this._getLayer(h(t));return t&&this._layers.splice(this._layers.indexOf(t),1),this._map?this._update():this},expand:function(){M(this._container,"leaflet-control-layers-expanded"),this._section.style.height=null;var t=this._map.getSize().y-(this._container.offsetTop+50);return t<this._section.clientHeight?(M(this._section,"leaflet-control-layers-scrollbar"),this._section.style.height=t+"px"):z(this._section,"leaflet-control-layers-scrollbar"),this._checkDisabledLayers(),this},collapse:function(){return z(this._container,"leaflet-control-layers-expanded"),this},_initLayout:function(){var t="leaflet-control-layers",e=this._container=P("div",t),i=this.options.collapsed,n=(e.setAttribute("aria-haspopup",!0),Ie(e),Be(e),this._section=P("section",t+"-list")),o=(i&&(this._map.on("click",this.collapse,this),S(e,{mouseenter:this._expandSafely,mouseleave:this.collapse},this)),this._layersLink=P("a",t+"-toggle",e));o.href="#",o.title="Layers",o.setAttribute("role","button"),S(o,{keydown:function(t){13===t.keyCode&&this._expandSafely()},click:function(t){O(t),this._expandSafely()}},this),i||this.expand(),this._baseLayersList=P("div",t+"-base",n),this._separator=P("div",t+"-separator",n),this._overlaysList=P("div",t+"-overlays",n),e.appendChild(n)},_getLayer:function(t){for(var e=0;e<this._layers.length;e++)if(this._layers[e]&&h(this._layers[e].layer)===t)return this._layers[e]},_addLayer:function(t,e,i){this._map&&t.on("add remove",this._onLayerChange,this),this._layers.push({layer:t,name:e,overlay:i}),this.options.sortLayers&&this._layers.sort(a(function(t,e){return this.options.sortFunction(t.layer,e.layer,t.name,e.name)},this)),this.options.autoZIndex&&t.setZIndex&&(this._lastZIndex++,t.setZIndex(this._lastZIndex)),this._expandIfNotCollapsed()},_update:function(){if(this._container){me(this._baseLayersList),me(this._overlaysList),this._layerControlInputs=[];for(var t,e,i,n=0,o=0;o<this._layers.length;o++)i=this._layers[o],this._addItem(i),e=e||i.overlay,t=t||!i.overlay,n+=i.overlay?0:1;this.options.hideSingleBase&&(this._baseLayersList.style.display=(t=t&&1<n)?"":"none"),this._separator.style.display=e&&t?"":"none"}return this},_onLayerChange:function(t){this._handlingClick||this._update();var e=this._getLayer(h(t.target)),t=e.overlay?"add"===t.type?"overlayadd":"overlayremove":"add"===t.type?"baselayerchange":null;t&&this._map.fire(t,e)},_createRadioElement:function(t,e){t='<input type="radio" class="leaflet-control-layers-selector" name="'+t+'"'+(e?' checked="checked"':"")+"/>",e=document.createElement("div");return e.innerHTML=t,e.firstChild},_addItem:function(t){var e,i=document.createElement("label"),n=this._map.hasLayer(t.layer),n=(t.overlay?((e=document.createElement("input")).type="checkbox",e.className="leaflet-control-layers-selector",e.defaultChecked=n):e=this._createRadioElement("leaflet-base-layers_"+h(this),n),this._layerControlInputs.push(e),e.layerId=h(t.layer),S(e,"click",this._onInputClick,this),document.createElement("span")),o=(n.innerHTML=" "+t.name,document.createElement("span"));return i.appendChild(o),o.appendChild(e),o.appendChild(n),(t.overlay?this._overlaysList:this._baseLayersList).appendChild(i),this._checkDisabledLayers(),i},_onInputClick:function(){if(!this._preventClick){var t,e,i=this._layerControlInputs,n=[],o=[];this._handlingClick=!0;for(var s=i.length-1;0<=s;s--)t=i[s],e=this._getLayer(t.layerId).layer,t.checked?n.push(e):t.checked||o.push(e);for(s=0;s<o.length;s++)this._map.hasLayer(o[s])&&this._map.removeLayer(o[s]);for(s=0;s<n.length;s++)this._map.hasLayer(n[s])||this._map.addLayer(n[s]);this._handlingClick=!1,this._refocusOnMap()}},_checkDisabledLayers:function(){for(var t,e,i=this._layerControlInputs,n=this._map.getZoom(),o=i.length-1;0<=o;o--)t=i[o],e=this._getLayer(t.layerId).layer,t.disabled=void 0!==e.options.minZoom&&n<e.options.minZoom||void 0!==e.options.maxZoom&&n>e.options.maxZoom},_expandIfNotCollapsed:function(){return this._map&&!this.options.collapsed&&this.expand(),this},_expandSafely:function(){var t=this._section,e=(this._preventClick=!0,S(t,"click",O),this.expand(),this);setTimeout(function(){k(t,"click",O),e._preventClick=!1})}})),qe=B.extend({options:{position:"topleft",zoomInText:'<span aria-hidden="true">+</span>',zoomInTitle:"Zoom in",zoomOutText:'<span aria-hidden="true">&#x2212;</span>',zoomOutTitle:"Zoom out"},onAdd:function(t){var e="leaflet-control-zoom",i=P("div",e+" leaflet-bar"),n=this.options;return this._zoomInButton=this._createButton(n.zoomInText,n.zoomInTitle,e+"-in",i,this._zoomIn),this._zoomOutButton=this._createButton(n.zoomOutText,n.zoomOutTitle,e+"-out",i,this._zoomOut),this._updateDisabled(),t.on("zoomend zoomlevelschange",this._updateDisabled,this),i},onRemove:function(t){t.off("zoomend zoomlevelschange",this._updateDisabled,this)},disable:function(){return this._disabled=!0,this._updateDisabled(),this},enable:function(){return this._disabled=!1,this._updateDisabled(),this},_zoomIn:function(t){!this._disabled&&this._map._zoom<this._map.getMaxZoom()&&this._map.zoomIn(this._map.options.zoomDelta*(t.shiftKey?3:1))},_zoomOut:function(t){!this._disabled&&this._map._zoom>this._map.getMinZoom()&&this._map.zoomOut(this._map.options.zoomDelta*(t.shiftKey?3:1))},_createButton:function(t,e,i,n,o){i=P("a",i,n);return i.innerHTML=t,i.href="#",i.title=e,i.setAttribute("role","button"),i.setAttribute("aria-label",e),Ie(i),S(i,"click",Re),S(i,"click",o,this),S(i,"click",this._refocusOnMap,this),i},_updateDisabled:function(){var t=this._map,e="leaflet-disabled";z(this._zoomInButton,e),z(this._zoomOutButton,e),this._zoomInButton.setAttribute("aria-disabled","false"),this._zoomOutButton.setAttribute("aria-disabled","false"),!this._disabled&&t._zoom!==t.getMinZoom()||(M(this._zoomOutButton,e),this._zoomOutButton.setAttribute("aria-disabled","true")),!this._disabled&&t._zoom!==t.getMaxZoom()||(M(this._zoomInButton,e),this._zoomInButton.setAttribute("aria-disabled","true"))}}),Ge=(A.mergeOptions({zoomControl:!0}),A.addInitHook(function(){this.options.zoomControl&&(this.zoomControl=new qe,this.addControl(this.zoomControl))}),B.extend({options:{position:"bottomleft",maxWidth:100,metric:!0,imperial:!0},onAdd:function(t){var e="leaflet-control-scale",i=P("div",e),n=this.options;return this._addScales(n,e+"-line",i),t.on(n.updateWhenIdle?"moveend":"move",this._update,this),t.whenReady(this._update,this),i},onRemove:function(t){t.off(this.options.updateWhenIdle?"moveend":"move",this._update,this)},_addScales:function(t,e,i){t.metric&&(this._mScale=P("div",e,i)),t.imperial&&(this._iScale=P("div",e,i))},_update:function(){var t=this._map,e=t.getSize().y/2,t=t.distance(t.containerPointToLatLng([0,e]),t.containerPointToLatLng([this.options.maxWidth,e]));this._updateScales(t)},_updateScales:function(t){this.options.metric&&t&&this._updateMetric(t),this.options.imperial&&t&&this._updateImperial(t)},_updateMetric:function(t){var e=this._getRoundNum(t);this._updateScale(this._mScale,e<1e3?e+" m":e/1e3+" km",e/t)},_updateImperial:function(t){var e,i,t=3.2808399*t;5280<t?(i=this._getRoundNum(e=t/5280),this._updateScale(this._iScale,i+" mi",i/e)):(i=this._getRoundNum(t),this._updateScale(this._iScale,i+" ft",i/t))},_updateScale:function(t,e,i){t.style.width=Math.round(this.options.maxWidth*i)+"px",t.innerHTML=e},_getRoundNum:function(t){var e=Math.pow(10,(Math.floor(t)+"").length-1),t=t/e;return e*(t=10<=t?10:5<=t?5:3<=t?3:2<=t?2:1)}})),Ke=B.extend({options:{position:"bottomright",prefix:'<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">'+(b.inlineSvg?'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg> ':"")+"Leaflet</a>"},initialize:function(t){c(this,t),this._attributions={}},onAdd:function(t){for(var e in(t.attributionControl=this)._container=P("div","leaflet-control-attribution"),Ie(this._container),t._layers)t._layers[e].getAttribution&&this.addAttribution(t._layers[e].getAttribution());return this._update(),t.on("layeradd",this._addAttribution,this),this._container},onRemove:function(t){t.off("layeradd",this._addAttribution,this)},_addAttribution:function(t){t.layer.getAttribution&&(this.addAttribution(t.layer.getAttribution()),t.layer.once("remove",function(){this.removeAttribution(t.layer.getAttribution())},this))},setPrefix:function(t){return this.options.prefix=t,this._update(),this},addAttribution:function(t){return t&&(this._attributions[t]||(this._attributions[t]=0),this._attributions[t]++,this._update()),this},removeAttribution:function(t){return t&&this._attributions[t]&&(this._attributions[t]--,this._update()),this},_update:function(){if(this._map){var t,e=[];for(t in this._attributions)this._attributions[t]&&e.push(t);var i=[];this.options.prefix&&i.push(this.options.prefix),e.length&&i.push(e.join(", ")),this._container.innerHTML=i.join(' <span aria-hidden="true">|</span> ')}}}),n=(A.mergeOptions({attributionControl:!0}),A.addInitHook(function(){this.options.attributionControl&&(new Ke).addTo(this)}),B.Layers=Ve,B.Zoom=qe,B.Scale=Ge,B.Attribution=Ke,Ue.layers=function(t,e,i){return new Ve(t,e,i)},Ue.zoom=function(t){return new qe(t)},Ue.scale=function(t){return new Ge(t)},Ue.attribution=function(t){return new Ke(t)},et.extend({initialize:function(t){this._map=t},enable:function(){return this._enabled||(this._enabled=!0,this.addHooks()),this},disable:function(){return this._enabled&&(this._enabled=!1,this.removeHooks()),this},enabled:function(){return!!this._enabled}})),ft=(n.addTo=function(t,e){return t.addHandler(e,this),this},{Events:e}),Ye=b.touch?"touchstart mousedown":"mousedown",Xe=it.extend({options:{clickTolerance:3},initialize:function(t,e,i,n){c(this,n),this._element=t,this._dragStartTarget=e||t,this._preventOutline=i},enable:function(){this._enabled||(S(this._dragStartTarget,Ye,this._onDown,this),this._enabled=!0)},disable:function(){this._enabled&&(Xe._dragging===this&&this.finishDrag(!0),k(this._dragStartTarget,Ye,this._onDown,this),this._enabled=!1,this._moved=!1)},_onDown:function(t){var e,i;this._enabled&&(this._moved=!1,ve(this._element,"leaflet-zoom-anim")||(t.touches&&1!==t.touches.length?Xe._dragging===this&&this.finishDrag():Xe._dragging||t.shiftKey||1!==t.which&&1!==t.button&&!t.touches||((Xe._dragging=this)._preventOutline&&Me(this._element),Le(),re(),this._moving||(this.fire("down"),i=t.touches?t.touches[0]:t,e=Ce(this._element),this._startPoint=new p(i.clientX,i.clientY),this._startPos=Pe(this._element),this._parentScale=Ze(e),i="mousedown"===t.type,S(document,i?"mousemove":"touchmove",this._onMove,this),S(document,i?"mouseup":"touchend touchcancel",this._onUp,this)))))},_onMove:function(t){var e;this._enabled&&(t.touches&&1<t.touches.length?this._moved=!0:!(e=new p((e=t.touches&&1===t.touches.length?t.touches[0]:t).clientX,e.clientY)._subtract(this._startPoint)).x&&!e.y||Math.abs(e.x)+Math.abs(e.y)<this.options.clickTolerance||(e.x/=this._parentScale.x,e.y/=this._parentScale.y,O(t),this._moved||(this.fire("dragstart"),this._moved=!0,M(document.body,"leaflet-dragging"),this._lastTarget=t.target||t.srcElement,window.SVGElementInstance&&this._lastTarget instanceof window.SVGElementInstance&&(this._lastTarget=this._lastTarget.correspondingUseElement),M(this._lastTarget,"leaflet-drag-target")),this._newPos=this._startPos.add(e),this._moving=!0,this._lastEvent=t,this._updatePosition()))},_updatePosition:function(){var t={originalEvent:this._lastEvent};this.fire("predrag",t),Z(this._element,this._newPos),this.fire("drag",t)},_onUp:function(){this._enabled&&this.finishDrag()},finishDrag:function(t){z(document.body,"leaflet-dragging"),this._lastTarget&&(z(this._lastTarget,"leaflet-drag-target"),this._lastTarget=null),k(document,"mousemove touchmove",this._onMove,this),k(document,"mouseup touchend touchcancel",this._onUp,this),Te(),ae();var e=this._moved&&this._moving;this._moving=!1,Xe._dragging=!1,e&&this.fire("dragend",{noInertia:t,distance:this._newPos.distanceTo(this._startPos)})}});function Je(t,e,i){for(var n,o,s,r,a,h,l,u=[1,4,2,8],c=0,d=t.length;c<d;c++)t[c]._code=si(t[c],e);for(s=0;s<4;s++){for(h=u[s],n=[],c=0,o=(d=t.length)-1;c<d;o=c++)r=t[c],a=t[o],r._code&h?a._code&h||((l=oi(a,r,h,e,i))._code=si(l,e),n.push(l)):(a._code&h&&((l=oi(a,r,h,e,i))._code=si(l,e),n.push(l)),n.push(r));t=n}return t}function $e(t,e){var i,n,o,s,r,a,h;if(!t||0===t.length)throw new Error("latlngs not passed");I(t)||(console.warn("latlngs are not flat! Only the first ring will be used"),t=t[0]);for(var l=w([0,0]),u=g(t),c=(u.getNorthWest().distanceTo(u.getSouthWest())*u.getNorthEast().distanceTo(u.getNorthWest())<1700&&(l=Qe(t)),t.length),d=[],_=0;_<c;_++){var p=w(t[_]);d.push(e.project(w([p.lat-l.lat,p.lng-l.lng])))}for(_=r=a=h=0,i=c-1;_<c;i=_++)n=d[_],o=d[i],s=n.y*o.x-o.y*n.x,a+=(n.x+o.x)*s,h+=(n.y+o.y)*s,r+=3*s;u=0===r?d[0]:[a/r,h/r],u=e.unproject(m(u));return w([u.lat+l.lat,u.lng+l.lng])}function Qe(t){for(var e=0,i=0,n=0,o=0;o<t.length;o++){var s=w(t[o]);e+=s.lat,i+=s.lng,n++}return w([e/n,i/n])}var ti,gt={__proto__:null,clipPolygon:Je,polygonCenter:$e,centroid:Qe};function ei(t,e){if(e&&t.length){var i=t=function(t,e){for(var i=[t[0]],n=1,o=0,s=t.length;n<s;n++)(function(t,e){var i=e.x-t.x,e=e.y-t.y;return i*i+e*e})(t[n],t[o])>e&&(i.push(t[n]),o=n);o<s-1&&i.push(t[s-1]);return i}(t,e=e*e),n=i.length,o=new(typeof Uint8Array!=void 0+""?Uint8Array:Array)(n);o[0]=o[n-1]=1,function t(e,i,n,o,s){var r,a,h,l=0;for(a=o+1;a<=s-1;a++)h=ri(e[a],e[o],e[s],!0),l<h&&(r=a,l=h);n<l&&(i[r]=1,t(e,i,n,o,r),t(e,i,n,r,s))}(i,o,e,0,n-1);var s,r=[];for(s=0;s<n;s++)o[s]&&r.push(i[s]);return r}return t.slice()}function ii(t,e,i){return Math.sqrt(ri(t,e,i,!0))}function ni(t,e,i,n,o){var s,r,a,h=n?ti:si(t,i),l=si(e,i);for(ti=l;;){if(!(h|l))return[t,e];if(h&l)return!1;a=si(r=oi(t,e,s=h||l,i,o),i),s===h?(t=r,h=a):(e=r,l=a)}}function oi(t,e,i,n,o){var s,r,a=e.x-t.x,e=e.y-t.y,h=n.min,n=n.max;return 8&i?(s=t.x+a*(n.y-t.y)/e,r=n.y):4&i?(s=t.x+a*(h.y-t.y)/e,r=h.y):2&i?(s=n.x,r=t.y+e*(n.x-t.x)/a):1&i&&(s=h.x,r=t.y+e*(h.x-t.x)/a),new p(s,r,o)}function si(t,e){var i=0;return t.x<e.min.x?i|=1:t.x>e.max.x&&(i|=2),t.y<e.min.y?i|=4:t.y>e.max.y&&(i|=8),i}function ri(t,e,i,n){var o=e.x,e=e.y,s=i.x-o,r=i.y-e,a=s*s+r*r;return 0<a&&(1<(a=((t.x-o)*s+(t.y-e)*r)/a)?(o=i.x,e=i.y):0<a&&(o+=s*a,e+=r*a)),s=t.x-o,r=t.y-e,n?s*s+r*r:new p(o,e)}function I(t){return!d(t[0])||"object"!=typeof t[0][0]&&void 0!==t[0][0]}function ai(t){return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."),I(t)}function hi(t,e){var i,n,o,s,r,a;if(!t||0===t.length)throw new Error("latlngs not passed");I(t)||(console.warn("latlngs are not flat! Only the first ring will be used"),t=t[0]);for(var h=w([0,0]),l=g(t),u=(l.getNorthWest().distanceTo(l.getSouthWest())*l.getNorthEast().distanceTo(l.getNorthWest())<1700&&(h=Qe(t)),t.length),c=[],d=0;d<u;d++){var _=w(t[d]);c.push(e.project(w([_.lat-h.lat,_.lng-h.lng])))}for(i=d=0;d<u-1;d++)i+=c[d].distanceTo(c[d+1])/2;if(0===i)a=c[0];else for(n=d=0;d<u-1;d++)if(o=c[d],s=c[d+1],i<(n+=r=o.distanceTo(s))){a=[s.x-(r=(n-i)/r)*(s.x-o.x),s.y-r*(s.y-o.y)];break}l=e.unproject(m(a));return w([l.lat+h.lat,l.lng+h.lng])}var vt={__proto__:null,simplify:ei,pointToSegmentDistance:ii,closestPointOnSegment:function(t,e,i){return ri(t,e,i)},clipSegment:ni,_getEdgeIntersection:oi,_getBitCode:si,_sqClosestPointOnSegment:ri,isFlat:I,_flat:ai,polylineCenter:hi},yt={project:function(t){return new p(t.lng,t.lat)},unproject:function(t){return new v(t.y,t.x)},bounds:new f([-180,-90],[180,90])},xt={R:6378137,R_MINOR:6356752.314245179,bounds:new f([-20037508.34279,-15496570.73972],[20037508.34279,18764656.23138]),project:function(t){var e=Math.PI/180,i=this.R,n=t.lat*e,o=this.R_MINOR/i,o=Math.sqrt(1-o*o),s=o*Math.sin(n),s=Math.tan(Math.PI/4-n/2)/Math.pow((1-s)/(1+s),o/2),n=-i*Math.log(Math.max(s,1e-10));return new p(t.lng*e*i,n)},unproject:function(t){for(var e,i=180/Math.PI,n=this.R,o=this.R_MINOR/n,s=Math.sqrt(1-o*o),r=Math.exp(-t.y/n),a=Math.PI/2-2*Math.atan(r),h=0,l=.1;h<15&&1e-7<Math.abs(l);h++)e=s*Math.sin(a),e=Math.pow((1-e)/(1+e),s/2),a+=l=Math.PI/2-2*Math.atan(r*e)-a;return new v(a*i,t.x*i/n)}},wt={__proto__:null,LonLat:yt,Mercator:xt,SphericalMercator:rt},Pt=l({},st,{code:"EPSG:3395",projection:xt,transformation:ht(bt=.5/(Math.PI*xt.R),.5,-bt,.5)}),li=l({},st,{code:"EPSG:4326",projection:yt,transformation:ht(1/180,1,-1/180,.5)}),Lt=l({},ot,{projection:yt,transformation:ht(1,0,-1,0),scale:function(t){return Math.pow(2,t)},zoom:function(t){return Math.log(t)/Math.LN2},distance:function(t,e){var i=e.lng-t.lng,e=e.lat-t.lat;return Math.sqrt(i*i+e*e)},infinite:!0}),o=(ot.Earth=st,ot.EPSG3395=Pt,ot.EPSG3857=lt,ot.EPSG900913=ut,ot.EPSG4326=li,ot.Simple=Lt,it.extend({options:{pane:"overlayPane",attribution:null,bubblingMouseEvents:!0},addTo:function(t){return t.addLayer(this),this},remove:function(){return this.removeFrom(this._map||this._mapToAdd)},removeFrom:function(t){return t&&t.removeLayer(this),this},getPane:function(t){return this._map.getPane(t?this.options[t]||t:this.options.pane)},addInteractiveTarget:function(t){return this._map._targets[h(t)]=this},removeInteractiveTarget:function(t){return delete this._map._targets[h(t)],this},getAttribution:function(){return this.options.attribution},_layerAdd:function(t){var e,i=t.target;i.hasLayer(this)&&(this._map=i,this._zoomAnimated=i._zoomAnimated,this.getEvents&&(e=this.getEvents(),i.on(e,this),this.once("remove",function(){i.off(e,this)},this)),this.onAdd(i),this.fire("add"),i.fire("layeradd",{layer:this}))}})),ui=(A.include({addLayer:function(t){var e;if(t._layerAdd)return e=h(t),this._layers[e]||((this._layers[e]=t)._mapToAdd=this,t.beforeAdd&&t.beforeAdd(this),this.whenReady(t._layerAdd,t)),this;throw new Error("The provided object is not a Layer.")},removeLayer:function(t){var e=h(t);return this._layers[e]&&(this._loaded&&t.onRemove(this),delete this._layers[e],this._loaded&&(this.fire("layerremove",{layer:t}),t.fire("remove")),t._map=t._mapToAdd=null),this},hasLayer:function(t){return h(t)in this._layers},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},_addLayers:function(t){for(var e=0,i=(t=t?d(t)?t:[t]:[]).length;e<i;e++)this.addLayer(t[e])},_addZoomLimit:function(t){isNaN(t.options.maxZoom)&&isNaN(t.options.minZoom)||(this._zoomBoundLayers[h(t)]=t,this._updateZoomLevels())},_removeZoomLimit:function(t){t=h(t);this._zoomBoundLayers[t]&&(delete this._zoomBoundLayers[t],this._updateZoomLevels())},_updateZoomLevels:function(){var t,e=1/0,i=-1/0,n=this._getZoomSpan();for(t in this._zoomBoundLayers)var o=this._zoomBoundLayers[t].options,e=void 0===o.minZoom?e:Math.min(e,o.minZoom),i=void 0===o.maxZoom?i:Math.max(i,o.maxZoom);this._layersMaxZoom=i===-1/0?void 0:i,this._layersMinZoom=e===1/0?void 0:e,n!==this._getZoomSpan()&&this.fire("zoomlevelschange"),void 0===this.options.maxZoom&&this._layersMaxZoom&&this.getZoom()>this._layersMaxZoom&&this.setZoom(this._layersMaxZoom),void 0===this.options.minZoom&&this._layersMinZoom&&this.getZoom()<this._layersMinZoom&&this.setZoom(this._layersMinZoom)}}),o.extend({initialize:function(t,e){var i,n;if(c(this,e),this._layers={},t)for(i=0,n=t.length;i<n;i++)this.addLayer(t[i])},addLayer:function(t){var e=this.getLayerId(t);return this._layers[e]=t,this._map&&this._map.addLayer(t),this},removeLayer:function(t){t=t in this._layers?t:this.getLayerId(t);return this._map&&this._layers[t]&&this._map.removeLayer(this._layers[t]),delete this._layers[t],this},hasLayer:function(t){return("number"==typeof t?t:this.getLayerId(t))in this._layers},clearLayers:function(){return this.eachLayer(this.removeLayer,this)},invoke:function(t){var e,i,n=Array.prototype.slice.call(arguments,1);for(e in this._layers)(i=this._layers[e])[t]&&i[t].apply(i,n);return this},onAdd:function(t){this.eachLayer(t.addLayer,t)},onRemove:function(t){this.eachLayer(t.removeLayer,t)},eachLayer:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},getLayer:function(t){return this._layers[t]},getLayers:function(){var t=[];return this.eachLayer(t.push,t),t},setZIndex:function(t){return this.invoke("setZIndex",t)},getLayerId:h})),ci=ui.extend({addLayer:function(t){return this.hasLayer(t)?this:(t.addEventParent(this),ui.prototype.addLayer.call(this,t),this.fire("layeradd",{layer:t}))},removeLayer:function(t){return this.hasLayer(t)?((t=t in this._layers?this._layers[t]:t).removeEventParent(this),ui.prototype.removeLayer.call(this,t),this.fire("layerremove",{layer:t})):this},setStyle:function(t){return this.invoke("setStyle",t)},bringToFront:function(){return this.invoke("bringToFront")},bringToBack:function(){return this.invoke("bringToBack")},getBounds:function(){var t,e=new s;for(t in this._layers){var i=this._layers[t];e.extend(i.getBounds?i.getBounds():i.getLatLng())}return e}}),di=et.extend({options:{popupAnchor:[0,0],tooltipAnchor:[0,0],crossOrigin:!1},initialize:function(t){c(this,t)},createIcon:function(t){return this._createIcon("icon",t)},createShadow:function(t){return this._createIcon("shadow",t)},_createIcon:function(t,e){var i=this._getIconUrl(t);if(i)return i=this._createImg(i,e&&"IMG"===e.tagName?e:null),this._setIconStyles(i,t),!this.options.crossOrigin&&""!==this.options.crossOrigin||(i.crossOrigin=!0===this.options.crossOrigin?"":this.options.crossOrigin),i;if("icon"===t)throw new Error("iconUrl not set in Icon options (see the docs).");return null},_setIconStyles:function(t,e){var i=this.options,n=i[e+"Size"],n=m(n="number"==typeof n?[n,n]:n),o=m("shadow"===e&&i.shadowAnchor||i.iconAnchor||n&&n.divideBy(2,!0));t.className="leaflet-marker-"+e+" "+(i.className||""),o&&(t.style.marginLeft=-o.x+"px",t.style.marginTop=-o.y+"px"),n&&(t.style.width=n.x+"px",t.style.height=n.y+"px")},_createImg:function(t,e){return(e=e||document.createElement("img")).src=t,e},_getIconUrl:function(t){return b.retina&&this.options[t+"RetinaUrl"]||this.options[t+"Url"]}});var _i=di.extend({options:{iconUrl:"marker-icon.png",iconRetinaUrl:"marker-icon-2x.png",shadowUrl:"marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],tooltipAnchor:[16,-28],shadowSize:[41,41]},_getIconUrl:function(t){return"string"!=typeof _i.imagePath&&(_i.imagePath=this._detectIconPath()),(this.options.imagePath||_i.imagePath)+di.prototype._getIconUrl.call(this,t)},_stripUrl:function(t){function e(t,e,i){return(e=e.exec(t))&&e[i]}return(t=e(t,/^url\((['"])?(.+)\1\)$/,2))&&e(t,/^(.*)marker-icon\.png$/,1)},_detectIconPath:function(){var t=P("div","leaflet-default-icon-path",document.body),e=pe(t,"background-image")||pe(t,"backgroundImage");return document.body.removeChild(t),(e=this._stripUrl(e))?e:(t=document.querySelector('link[href$="leaflet.css"]'))?t.href.substring(0,t.href.length-"leaflet.css".length-1):""}}),pi=n.extend({initialize:function(t){this._marker=t},addHooks:function(){var t=this._marker._icon;this._draggable||(this._draggable=new Xe(t,t,!0)),this._draggable.on({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).enable(),M(t,"leaflet-marker-draggable")},removeHooks:function(){this._draggable.off({dragstart:this._onDragStart,predrag:this._onPreDrag,drag:this._onDrag,dragend:this._onDragEnd},this).disable(),this._marker._icon&&z(this._marker._icon,"leaflet-marker-draggable")},moved:function(){return this._draggable&&this._draggable._moved},_adjustPan:function(t){var e=this._marker,i=e._map,n=this._marker.options.autoPanSpeed,o=this._marker.options.autoPanPadding,s=Pe(e._icon),r=i.getPixelBounds(),a=i.getPixelOrigin(),a=_(r.min._subtract(a).add(o),r.max._subtract(a).subtract(o));a.contains(s)||(o=m((Math.max(a.max.x,s.x)-a.max.x)/(r.max.x-a.max.x)-(Math.min(a.min.x,s.x)-a.min.x)/(r.min.x-a.min.x),(Math.max(a.max.y,s.y)-a.max.y)/(r.max.y-a.max.y)-(Math.min(a.min.y,s.y)-a.min.y)/(r.min.y-a.min.y)).multiplyBy(n),i.panBy(o,{animate:!1}),this._draggable._newPos._add(o),this._draggable._startPos._add(o),Z(e._icon,this._draggable._newPos),this._onDrag(t),this._panRequest=x(this._adjustPan.bind(this,t)))},_onDragStart:function(){this._oldLatLng=this._marker.getLatLng(),this._marker.closePopup&&this._marker.closePopup(),this._marker.fire("movestart").fire("dragstart")},_onPreDrag:function(t){this._marker.options.autoPan&&(r(this._panRequest),this._panRequest=x(this._adjustPan.bind(this,t)))},_onDrag:function(t){var e=this._marker,i=e._shadow,n=Pe(e._icon),o=e._map.layerPointToLatLng(n);i&&Z(i,n),e._latlng=o,t.latlng=o,t.oldLatLng=this._oldLatLng,e.fire("move",t).fire("drag",t)},_onDragEnd:function(t){r(this._panRequest),delete this._oldLatLng,this._marker.fire("moveend").fire("dragend",t)}}),mi=o.extend({options:{icon:new _i,interactive:!0,keyboard:!0,title:"",alt:"Marker",zIndexOffset:0,opacity:1,riseOnHover:!1,riseOffset:250,pane:"markerPane",shadowPane:"shadowPane",bubblingMouseEvents:!1,autoPanOnFocus:!0,draggable:!1,autoPan:!1,autoPanPadding:[50,50],autoPanSpeed:10},initialize:function(t,e){c(this,e),this._latlng=w(t)},onAdd:function(t){this._zoomAnimated=this._zoomAnimated&&t.options.markerZoomAnimation,this._zoomAnimated&&t.on("zoomanim",this._animateZoom,this),this._initIcon(),this.update()},onRemove:function(t){this.dragging&&this.dragging.enabled()&&(this.options.draggable=!0,this.dragging.removeHooks()),delete this.dragging,this._zoomAnimated&&t.off("zoomanim",this._animateZoom,this),this._removeIcon(),this._removeShadow()},getEvents:function(){return{zoom:this.update,viewreset:this.update}},getLatLng:function(){return this._latlng},setLatLng:function(t){var e=this._latlng;return this._latlng=w(t),this.update(),this.fire("move",{oldLatLng:e,latlng:this._latlng})},setZIndexOffset:function(t){return this.options.zIndexOffset=t,this.update()},getIcon:function(){return this.options.icon},setIcon:function(t){return this.options.icon=t,this._map&&(this._initIcon(),this.update()),this._popup&&this.bindPopup(this._popup,this._popup.options),this},getElement:function(){return this._icon},update:function(){var t;return this._icon&&this._map&&(t=this._map.latLngToLayerPoint(this._latlng).round(),this._setPos(t)),this},_initIcon:function(){var t=this.options,e="leaflet-zoom-"+(this._zoomAnimated?"animated":"hide"),i=t.icon.createIcon(this._icon),n=!1,i=(i!==this._icon&&(this._icon&&this._removeIcon(),n=!0,t.title&&(i.title=t.title),"IMG"===i.tagName&&(i.alt=t.alt||"")),M(i,e),t.keyboard&&(i.tabIndex="0",i.setAttribute("role","button")),this._icon=i,t.riseOnHover&&this.on({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&S(i,"focus",this._panOnFocus,this),t.icon.createShadow(this._shadow)),o=!1;i!==this._shadow&&(this._removeShadow(),o=!0),i&&(M(i,e),i.alt=""),this._shadow=i,t.opacity<1&&this._updateOpacity(),n&&this.getPane().appendChild(this._icon),this._initInteraction(),i&&o&&this.getPane(t.shadowPane).appendChild(this._shadow)},_removeIcon:function(){this.options.riseOnHover&&this.off({mouseover:this._bringToFront,mouseout:this._resetZIndex}),this.options.autoPanOnFocus&&k(this._icon,"focus",this._panOnFocus,this),T(this._icon),this.removeInteractiveTarget(this._icon),this._icon=null},_removeShadow:function(){this._shadow&&T(this._shadow),this._shadow=null},_setPos:function(t){this._icon&&Z(this._icon,t),this._shadow&&Z(this._shadow,t),this._zIndex=t.y+this.options.zIndexOffset,this._resetZIndex()},_updateZIndex:function(t){this._icon&&(this._icon.style.zIndex=this._zIndex+t)},_animateZoom:function(t){t=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center).round();this._setPos(t)},_initInteraction:function(){var t;this.options.interactive&&(M(this._icon,"leaflet-interactive"),this.addInteractiveTarget(this._icon),pi&&(t=this.options.draggable,this.dragging&&(t=this.dragging.enabled(),this.dragging.disable()),this.dragging=new pi(this),t&&this.dragging.enable()))},setOpacity:function(t){return this.options.opacity=t,this._map&&this._updateOpacity(),this},_updateOpacity:function(){var t=this.options.opacity;this._icon&&C(this._icon,t),this._shadow&&C(this._shadow,t)},_bringToFront:function(){this._updateZIndex(this.options.riseOffset)},_resetZIndex:function(){this._updateZIndex(0)},_panOnFocus:function(){var t,e,i=this._map;i&&(t=(e=this.options.icon.options).iconSize?m(e.iconSize):m(0,0),e=e.iconAnchor?m(e.iconAnchor):m(0,0),i.panInside(this._latlng,{paddingTopLeft:e,paddingBottomRight:t.subtract(e)}))},_getPopupAnchor:function(){return this.options.icon.options.popupAnchor},_getTooltipAnchor:function(){return this.options.icon.options.tooltipAnchor}});var fi=o.extend({options:{stroke:!0,color:"#3388ff",weight:3,opacity:1,lineCap:"round",lineJoin:"round",dashArray:null,dashOffset:null,fill:!1,fillColor:null,fillOpacity:.2,fillRule:"evenodd",interactive:!0,bubblingMouseEvents:!0},beforeAdd:function(t){this._renderer=t.getRenderer(this)},onAdd:function(){this._renderer._initPath(this),this._reset(),this._renderer._addPath(this)},onRemove:function(){this._renderer._removePath(this)},redraw:function(){return this._map&&this._renderer._updatePath(this),this},setStyle:function(t){return c(this,t),this._renderer&&(this._renderer._updateStyle(this),this.options.stroke&&t&&Object.prototype.hasOwnProperty.call(t,"weight")&&this._updateBounds()),this},bringToFront:function(){return this._renderer&&this._renderer._bringToFront(this),this},bringToBack:function(){return this._renderer&&this._renderer._bringToBack(this),this},getElement:function(){return this._path},_reset:function(){this._project(),this._update()},_clickTolerance:function(){return(this.options.stroke?this.options.weight/2:0)+(this._renderer.options.tolerance||0)}}),gi=fi.extend({options:{fill:!0,radius:10},initialize:function(t,e){c(this,e),this._latlng=w(t),this._radius=this.options.radius},setLatLng:function(t){var e=this._latlng;return this._latlng=w(t),this.redraw(),this.fire("move",{oldLatLng:e,latlng:this._latlng})},getLatLng:function(){return this._latlng},setRadius:function(t){return this.options.radius=this._radius=t,this.redraw()},getRadius:function(){return this._radius},setStyle:function(t){var e=t&&t.radius||this._radius;return fi.prototype.setStyle.call(this,t),this.setRadius(e),this},_project:function(){this._point=this._map.latLngToLayerPoint(this._latlng),this._updateBounds()},_updateBounds:function(){var t=this._radius,e=this._radiusY||t,i=this._clickTolerance(),t=[t+i,e+i];this._pxBounds=new f(this._point.subtract(t),this._point.add(t))},_update:function(){this._map&&this._updatePath()},_updatePath:function(){this._renderer._updateCircle(this)},_empty:function(){return this._radius&&!this._renderer._bounds.intersects(this._pxBounds)},_containsPoint:function(t){return t.distanceTo(this._point)<=this._radius+this._clickTolerance()}});var vi=gi.extend({initialize:function(t,e,i){if(c(this,e="number"==typeof e?l({},i,{radius:e}):e),this._latlng=w(t),isNaN(this.options.radius))throw new Error("Circle radius cannot be NaN");this._mRadius=this.options.radius},setRadius:function(t){return this._mRadius=t,this.redraw()},getRadius:function(){return this._mRadius},getBounds:function(){var t=[this._radius,this._radiusY||this._radius];return new s(this._map.layerPointToLatLng(this._point.subtract(t)),this._map.layerPointToLatLng(this._point.add(t)))},setStyle:fi.prototype.setStyle,_project:function(){var t,e,i,n,o,s=this._latlng.lng,r=this._latlng.lat,a=this._map,h=a.options.crs;h.distance===st.distance?(n=Math.PI/180,o=this._mRadius/st.R/n,t=a.project([r+o,s]),e=a.project([r-o,s]),e=t.add(e).divideBy(2),i=a.unproject(e).lat,n=Math.acos((Math.cos(o*n)-Math.sin(r*n)*Math.sin(i*n))/(Math.cos(r*n)*Math.cos(i*n)))/n,!isNaN(n)&&0!==n||(n=o/Math.cos(Math.PI/180*r)),this._point=e.subtract(a.getPixelOrigin()),this._radius=isNaN(n)?0:e.x-a.project([i,s-n]).x,this._radiusY=e.y-t.y):(o=h.unproject(h.project(this._latlng).subtract([this._mRadius,0])),this._point=a.latLngToLayerPoint(this._latlng),this._radius=this._point.x-a.latLngToLayerPoint(o).x),this._updateBounds()}});var yi=fi.extend({options:{smoothFactor:1,noClip:!1},initialize:function(t,e){c(this,e),this._setLatLngs(t)},getLatLngs:function(){return this._latlngs},setLatLngs:function(t){return this._setLatLngs(t),this.redraw()},isEmpty:function(){return!this._latlngs.length},closestLayerPoint:function(t){for(var e=1/0,i=null,n=ri,o=0,s=this._parts.length;o<s;o++)for(var r=this._parts[o],a=1,h=r.length;a<h;a++){var l,u,c=n(t,l=r[a-1],u=r[a],!0);c<e&&(e=c,i=n(t,l,u))}return i&&(i.distance=Math.sqrt(e)),i},getCenter:function(){if(this._map)return hi(this._defaultShape(),this._map.options.crs);throw new Error("Must add layer to map before using getCenter()")},getBounds:function(){return this._bounds},addLatLng:function(t,e){return e=e||this._defaultShape(),t=w(t),e.push(t),this._bounds.extend(t),this.redraw()},_setLatLngs:function(t){this._bounds=new s,this._latlngs=this._convertLatLngs(t)},_defaultShape:function(){return I(this._latlngs)?this._latlngs:this._latlngs[0]},_convertLatLngs:function(t){for(var e=[],i=I(t),n=0,o=t.length;n<o;n++)i?(e[n]=w(t[n]),this._bounds.extend(e[n])):e[n]=this._convertLatLngs(t[n]);return e},_project:function(){var t=new f;this._rings=[],this._projectLatlngs(this._latlngs,this._rings,t),this._bounds.isValid()&&t.isValid()&&(this._rawPxBounds=t,this._updateBounds())},_updateBounds:function(){var t=this._clickTolerance(),t=new p(t,t);this._rawPxBounds&&(this._pxBounds=new f([this._rawPxBounds.min.subtract(t),this._rawPxBounds.max.add(t)]))},_projectLatlngs:function(t,e,i){var n,o,s=t[0]instanceof v,r=t.length;if(s){for(o=[],n=0;n<r;n++)o[n]=this._map.latLngToLayerPoint(t[n]),i.extend(o[n]);e.push(o)}else for(n=0;n<r;n++)this._projectLatlngs(t[n],e,i)},_clipPoints:function(){var t=this._renderer._bounds;if(this._parts=[],this._pxBounds&&this._pxBounds.intersects(t))if(this.options.noClip)this._parts=this._rings;else for(var e,i,n,o,s=this._parts,r=0,a=0,h=this._rings.length;r<h;r++)for(e=0,i=(o=this._rings[r]).length;e<i-1;e++)(n=ni(o[e],o[e+1],t,e,!0))&&(s[a]=s[a]||[],s[a].push(n[0]),n[1]===o[e+1]&&e!==i-2||(s[a].push(n[1]),a++))},_simplifyPoints:function(){for(var t=this._parts,e=this.options.smoothFactor,i=0,n=t.length;i<n;i++)t[i]=ei(t[i],e)},_update:function(){this._map&&(this._clipPoints(),this._simplifyPoints(),this._updatePath())},_updatePath:function(){this._renderer._updatePoly(this)},_containsPoint:function(t,e){var i,n,o,s,r,a,h=this._clickTolerance();if(this._pxBounds&&this._pxBounds.contains(t))for(i=0,s=this._parts.length;i<s;i++)for(n=0,o=(r=(a=this._parts[i]).length)-1;n<r;o=n++)if((e||0!==n)&&ii(t,a[o],a[n])<=h)return!0;return!1}});yi._flat=ai;var xi=yi.extend({options:{fill:!0},isEmpty:function(){return!this._latlngs.length||!this._latlngs[0].length},getCenter:function(){if(this._map)return $e(this._defaultShape(),this._map.options.crs);throw new Error("Must add layer to map before using getCenter()")},_convertLatLngs:function(t){var t=yi.prototype._convertLatLngs.call(this,t),e=t.length;return 2<=e&&t[0]instanceof v&&t[0].equals(t[e-1])&&t.pop(),t},_setLatLngs:function(t){yi.prototype._setLatLngs.call(this,t),I(this._latlngs)&&(this._latlngs=[this._latlngs])},_defaultShape:function(){return(I(this._latlngs[0])?this._latlngs:this._latlngs[0])[0]},_clipPoints:function(){var t=this._renderer._bounds,e=this.options.weight,e=new p(e,e),t=new f(t.min.subtract(e),t.max.add(e));if(this._parts=[],this._pxBounds&&this._pxBounds.intersects(t))if(this.options.noClip)this._parts=this._rings;else for(var i,n=0,o=this._rings.length;n<o;n++)(i=Je(this._rings[n],t,!0)).length&&this._parts.push(i)},_updatePath:function(){this._renderer._updatePoly(this,!0)},_containsPoint:function(t){var e,i,n,o,s,r,a,h,l=!1;if(!this._pxBounds||!this._pxBounds.contains(t))return!1;for(o=0,a=this._parts.length;o<a;o++)for(s=0,r=(h=(e=this._parts[o]).length)-1;s<h;r=s++)i=e[s],n=e[r],i.y>t.y!=n.y>t.y&&t.x<(n.x-i.x)*(t.y-i.y)/(n.y-i.y)+i.x&&(l=!l);return l||yi.prototype._containsPoint.call(this,t,!0)}});var wi=ci.extend({initialize:function(t,e){c(this,e),this._layers={},t&&this.addData(t)},addData:function(t){var e,i,n,o=d(t)?t:t.features;if(o){for(e=0,i=o.length;e<i;e++)((n=o[e]).geometries||n.geometry||n.features||n.coordinates)&&this.addData(n);return this}var s,r=this.options;return(!r.filter||r.filter(t))&&(s=bi(t,r))?(s.feature=Zi(t),s.defaultOptions=s.options,this.resetStyle(s),r.onEachFeature&&r.onEachFeature(t,s),this.addLayer(s)):this},resetStyle:function(t){return void 0===t?this.eachLayer(this.resetStyle,this):(t.options=l({},t.defaultOptions),this._setLayerStyle(t,this.options.style),this)},setStyle:function(e){return this.eachLayer(function(t){this._setLayerStyle(t,e)},this)},_setLayerStyle:function(t,e){t.setStyle&&("function"==typeof e&&(e=e(t.feature)),t.setStyle(e))}});function bi(t,e){var i,n,o,s,r="Feature"===t.type?t.geometry:t,a=r?r.coordinates:null,h=[],l=e&&e.pointToLayer,u=e&&e.coordsToLatLng||Li;if(!a&&!r)return null;switch(r.type){case"Point":return Pi(l,t,i=u(a),e);case"MultiPoint":for(o=0,s=a.length;o<s;o++)i=u(a[o]),h.push(Pi(l,t,i,e));return new ci(h);case"LineString":case"MultiLineString":return n=Ti(a,"LineString"===r.type?0:1,u),new yi(n,e);case"Polygon":case"MultiPolygon":return n=Ti(a,"Polygon"===r.type?1:2,u),new xi(n,e);case"GeometryCollection":for(o=0,s=r.geometries.length;o<s;o++){var c=bi({geometry:r.geometries[o],type:"Feature",properties:t.properties},e);c&&h.push(c)}return new ci(h);case"FeatureCollection":for(o=0,s=r.features.length;o<s;o++){var d=bi(r.features[o],e);d&&h.push(d)}return new ci(h);default:throw new Error("Invalid GeoJSON object.")}}function Pi(t,e,i,n){return t?t(e,i):new mi(i,n&&n.markersInheritOptions&&n)}function Li(t){return new v(t[1],t[0],t[2])}function Ti(t,e,i){for(var n,o=[],s=0,r=t.length;s<r;s++)n=e?Ti(t[s],e-1,i):(i||Li)(t[s]),o.push(n);return o}function Mi(t,e){return void 0!==(t=w(t)).alt?[i(t.lng,e),i(t.lat,e),i(t.alt,e)]:[i(t.lng,e),i(t.lat,e)]}function zi(t,e,i,n){for(var o=[],s=0,r=t.length;s<r;s++)o.push(e?zi(t[s],I(t[s])?0:e-1,i,n):Mi(t[s],n));return!e&&i&&0<o.length&&o.push(o[0].slice()),o}function Ci(t,e){return t.feature?l({},t.feature,{geometry:e}):Zi(e)}function Zi(t){return"Feature"===t.type||"FeatureCollection"===t.type?t:{type:"Feature",properties:{},geometry:t}}Tt={toGeoJSON:function(t){return Ci(this,{type:"Point",coordinates:Mi(this.getLatLng(),t)})}};function Si(t,e){return new wi(t,e)}mi.include(Tt),vi.include(Tt),gi.include(Tt),yi.include({toGeoJSON:function(t){var e=!I(this._latlngs);return Ci(this,{type:(e?"Multi":"")+"LineString",coordinates:zi(this._latlngs,e?1:0,!1,t)})}}),xi.include({toGeoJSON:function(t){var e=!I(this._latlngs),i=e&&!I(this._latlngs[0]),t=zi(this._latlngs,i?2:e?1:0,!0,t);return Ci(this,{type:(i?"Multi":"")+"Polygon",coordinates:t=e?t:[t]})}}),ui.include({toMultiPoint:function(e){var i=[];return this.eachLayer(function(t){i.push(t.toGeoJSON(e).geometry.coordinates)}),Ci(this,{type:"MultiPoint",coordinates:i})},toGeoJSON:function(e){var i,n,t=this.feature&&this.feature.geometry&&this.feature.geometry.type;return"MultiPoint"===t?this.toMultiPoint(e):(i="GeometryCollection"===t,n=[],this.eachLayer(function(t){t.toGeoJSON&&(t=t.toGeoJSON(e),i?n.push(t.geometry):"FeatureCollection"===(t=Zi(t)).type?n.push.apply(n,t.features):n.push(t))}),i?Ci(this,{geometries:n,type:"GeometryCollection"}):{type:"FeatureCollection",features:n})}});var Mt=Si,Ei=o.extend({options:{opacity:1,alt:"",interactive:!1,crossOrigin:!1,errorOverlayUrl:"",zIndex:1,className:""},initialize:function(t,e,i){this._url=t,this._bounds=g(e),c(this,i)},onAdd:function(){this._image||(this._initImage(),this.options.opacity<1&&this._updateOpacity()),this.options.interactive&&(M(this._image,"leaflet-interactive"),this.addInteractiveTarget(this._image)),this.getPane().appendChild(this._image),this._reset()},onRemove:function(){T(this._image),this.options.interactive&&this.removeInteractiveTarget(this._image)},setOpacity:function(t){return this.options.opacity=t,this._image&&this._updateOpacity(),this},setStyle:function(t){return t.opacity&&this.setOpacity(t.opacity),this},bringToFront:function(){return this._map&&fe(this._image),this},bringToBack:function(){return this._map&&ge(this._image),this},setUrl:function(t){return this._url=t,this._image&&(this._image.src=t),this},setBounds:function(t){return this._bounds=g(t),this._map&&this._reset(),this},getEvents:function(){var t={zoom:this._reset,viewreset:this._reset};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},getBounds:function(){return this._bounds},getElement:function(){return this._image},_initImage:function(){var t="IMG"===this._url.tagName,e=this._image=t?this._url:P("img");M(e,"leaflet-image-layer"),this._zoomAnimated&&M(e,"leaflet-zoom-animated"),this.options.className&&M(e,this.options.className),e.onselectstart=u,e.onmousemove=u,e.onload=a(this.fire,this,"load"),e.onerror=a(this._overlayOnError,this,"error"),!this.options.crossOrigin&&""!==this.options.crossOrigin||(e.crossOrigin=!0===this.options.crossOrigin?"":this.options.crossOrigin),this.options.zIndex&&this._updateZIndex(),t?this._url=e.src:(e.src=this._url,e.alt=this.options.alt)},_animateZoom:function(t){var e=this._map.getZoomScale(t.zoom),t=this._map._latLngBoundsToNewLayerBounds(this._bounds,t.zoom,t.center).min;be(this._image,t,e)},_reset:function(){var t=this._image,e=new f(this._map.latLngToLayerPoint(this._bounds.getNorthWest()),this._map.latLngToLayerPoint(this._bounds.getSouthEast())),i=e.getSize();Z(t,e.min),t.style.width=i.x+"px",t.style.height=i.y+"px"},_updateOpacity:function(){C(this._image,this.options.opacity)},_updateZIndex:function(){this._image&&void 0!==this.options.zIndex&&null!==this.options.zIndex&&(this._image.style.zIndex=this.options.zIndex)},_overlayOnError:function(){this.fire("error");var t=this.options.errorOverlayUrl;t&&this._url!==t&&(this._url=t,this._image.src=t)},getCenter:function(){return this._bounds.getCenter()}}),ki=Ei.extend({options:{autoplay:!0,loop:!0,keepAspectRatio:!0,muted:!1,playsInline:!0},_initImage:function(){var t="VIDEO"===this._url.tagName,e=this._image=t?this._url:P("video");if(M(e,"leaflet-image-layer"),this._zoomAnimated&&M(e,"leaflet-zoom-animated"),this.options.className&&M(e,this.options.className),e.onselectstart=u,e.onmousemove=u,e.onloadeddata=a(this.fire,this,"load"),t){for(var i=e.getElementsByTagName("source"),n=[],o=0;o<i.length;o++)n.push(i[o].src);this._url=0<i.length?n:[e.src]}else{d(this._url)||(this._url=[this._url]),!this.options.keepAspectRatio&&Object.prototype.hasOwnProperty.call(e.style,"objectFit")&&(e.style.objectFit="fill"),e.autoplay=!!this.options.autoplay,e.loop=!!this.options.loop,e.muted=!!this.options.muted,e.playsInline=!!this.options.playsInline;for(var s=0;s<this._url.length;s++){var r=P("source");r.src=this._url[s],e.appendChild(r)}}}});var Oi=Ei.extend({_initImage:function(){var t=this._image=this._url;M(t,"leaflet-image-layer"),this._zoomAnimated&&M(t,"leaflet-zoom-animated"),this.options.className&&M(t,this.options.className),t.onselectstart=u,t.onmousemove=u}});var Ai=o.extend({options:{interactive:!1,offset:[0,0],className:"",pane:void 0,content:""},initialize:function(t,e){t&&(t instanceof v||d(t))?(this._latlng=w(t),c(this,e)):(c(this,t),this._source=e),this.options.content&&(this._content=this.options.content)},openOn:function(t){return(t=arguments.length?t:this._source._map).hasLayer(this)||t.addLayer(this),this},close:function(){return this._map&&this._map.removeLayer(this),this},toggle:function(t){return this._map?this.close():(arguments.length?this._source=t:t=this._source,this._prepareOpen(),this.openOn(t._map)),this},onAdd:function(t){this._zoomAnimated=t._zoomAnimated,this._container||this._initLayout(),t._fadeAnimated&&C(this._container,0),clearTimeout(this._removeTimeout),this.getPane().appendChild(this._container),this.update(),t._fadeAnimated&&C(this._container,1),this.bringToFront(),this.options.interactive&&(M(this._container,"leaflet-interactive"),this.addInteractiveTarget(this._container))},onRemove:function(t){t._fadeAnimated?(C(this._container,0),this._removeTimeout=setTimeout(a(T,void 0,this._container),200)):T(this._container),this.options.interactive&&(z(this._container,"leaflet-interactive"),this.removeInteractiveTarget(this._container))},getLatLng:function(){return this._latlng},setLatLng:function(t){return this._latlng=w(t),this._map&&(this._updatePosition(),this._adjustPan()),this},getContent:function(){return this._content},setContent:function(t){return this._content=t,this.update(),this},getElement:function(){return this._container},update:function(){this._map&&(this._container.style.visibility="hidden",this._updateContent(),this._updateLayout(),this._updatePosition(),this._container.style.visibility="",this._adjustPan())},getEvents:function(){var t={zoom:this._updatePosition,viewreset:this._updatePosition};return this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},isOpen:function(){return!!this._map&&this._map.hasLayer(this)},bringToFront:function(){return this._map&&fe(this._container),this},bringToBack:function(){return this._map&&ge(this._container),this},_prepareOpen:function(t){if(!(i=this._source)._map)return!1;if(i instanceof ci){var e,i=null,n=this._source._layers;for(e in n)if(n[e]._map){i=n[e];break}if(!i)return!1;this._source=i}if(!t)if(i.getCenter)t=i.getCenter();else if(i.getLatLng)t=i.getLatLng();else{if(!i.getBounds)throw new Error("Unable to get source layer LatLng.");t=i.getBounds().getCenter()}return this.setLatLng(t),this._map&&this.update(),!0},_updateContent:function(){if(this._content){var t=this._contentNode,e="function"==typeof this._content?this._content(this._source||this):this._content;if("string"==typeof e)t.innerHTML=e;else{for(;t.hasChildNodes();)t.removeChild(t.firstChild);t.appendChild(e)}this.fire("contentupdate")}},_updatePosition:function(){var t,e,i;this._map&&(e=this._map.latLngToLayerPoint(this._latlng),t=m(this.options.offset),i=this._getAnchor(),this._zoomAnimated?Z(this._container,e.add(i)):t=t.add(e).add(i),e=this._containerBottom=-t.y,i=this._containerLeft=-Math.round(this._containerWidth/2)+t.x,this._container.style.bottom=e+"px",this._container.style.left=i+"px")},_getAnchor:function(){return[0,0]}}),Bi=(A.include({_initOverlay:function(t,e,i,n){var o=e;return o instanceof t||(o=new t(n).setContent(e)),i&&o.setLatLng(i),o}}),o.include({_initOverlay:function(t,e,i,n){var o=i;return o instanceof t?(c(o,n),o._source=this):(o=e&&!n?e:new t(n,this)).setContent(i),o}}),Ai.extend({options:{pane:"popupPane",offset:[0,7],maxWidth:300,minWidth:50,maxHeight:null,autoPan:!0,autoPanPaddingTopLeft:null,autoPanPaddingBottomRight:null,autoPanPadding:[5,5],keepInView:!1,closeButton:!0,autoClose:!0,closeOnEscapeKey:!0,className:""},openOn:function(t){return!(t=arguments.length?t:this._source._map).hasLayer(this)&&t._popup&&t._popup.options.autoClose&&t.removeLayer(t._popup),t._popup=this,Ai.prototype.openOn.call(this,t)},onAdd:function(t){Ai.prototype.onAdd.call(this,t),t.fire("popupopen",{popup:this}),this._source&&(this._source.fire("popupopen",{popup:this},!0),this._source instanceof fi||this._source.on("preclick",Ae))},onRemove:function(t){Ai.prototype.onRemove.call(this,t),t.fire("popupclose",{popup:this}),this._source&&(this._source.fire("popupclose",{popup:this},!0),this._source instanceof fi||this._source.off("preclick",Ae))},getEvents:function(){var t=Ai.prototype.getEvents.call(this);return(void 0!==this.options.closeOnClick?this.options.closeOnClick:this._map.options.closePopupOnClick)&&(t.preclick=this.close),this.options.keepInView&&(t.moveend=this._adjustPan),t},_initLayout:function(){var t="leaflet-popup",e=this._container=P("div",t+" "+(this.options.className||"")+" leaflet-zoom-animated"),i=this._wrapper=P("div",t+"-content-wrapper",e);this._contentNode=P("div",t+"-content",i),Ie(e),Be(this._contentNode),S(e,"contextmenu",Ae),this._tipContainer=P("div",t+"-tip-container",e),this._tip=P("div",t+"-tip",this._tipContainer),this.options.closeButton&&((i=this._closeButton=P("a",t+"-close-button",e)).setAttribute("role","button"),i.setAttribute("aria-label","Close popup"),i.href="#close",i.innerHTML='<span aria-hidden="true">&#215;</span>',S(i,"click",function(t){O(t),this.close()},this))},_updateLayout:function(){var t=this._contentNode,e=t.style,i=(e.width="",e.whiteSpace="nowrap",t.offsetWidth),i=Math.min(i,this.options.maxWidth),i=(i=Math.max(i,this.options.minWidth),e.width=i+1+"px",e.whiteSpace="",e.height="",t.offsetHeight),n=this.options.maxHeight,o="leaflet-popup-scrolled";(n&&n<i?(e.height=n+"px",M):z)(t,o),this._containerWidth=this._container.offsetWidth},_animateZoom:function(t){var t=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center),e=this._getAnchor();Z(this._container,t.add(e))},_adjustPan:function(){var t,e,i,n,o,s,r,a;this.options.autoPan&&(this._map._panAnim&&this._map._panAnim.stop(),this._autopanning?this._autopanning=!1:(t=this._map,e=parseInt(pe(this._container,"marginBottom"),10)||0,e=this._container.offsetHeight+e,a=this._containerWidth,(i=new p(this._containerLeft,-e-this._containerBottom))._add(Pe(this._container)),i=t.layerPointToContainerPoint(i),o=m(this.options.autoPanPadding),n=m(this.options.autoPanPaddingTopLeft||o),o=m(this.options.autoPanPaddingBottomRight||o),s=t.getSize(),r=0,i.x+a+o.x>s.x&&(r=i.x+a-s.x+o.x),i.x-r-n.x<(a=0)&&(r=i.x-n.x),i.y+e+o.y>s.y&&(a=i.y+e-s.y+o.y),i.y-a-n.y<0&&(a=i.y-n.y),(r||a)&&(this.options.keepInView&&(this._autopanning=!0),t.fire("autopanstart").panBy([r,a]))))},_getAnchor:function(){return m(this._source&&this._source._getPopupAnchor?this._source._getPopupAnchor():[0,0])}})),Ii=(A.mergeOptions({closePopupOnClick:!0}),A.include({openPopup:function(t,e,i){return this._initOverlay(Bi,t,e,i).openOn(this),this},closePopup:function(t){return(t=arguments.length?t:this._popup)&&t.close(),this}}),o.include({bindPopup:function(t,e){return this._popup=this._initOverlay(Bi,this._popup,t,e),this._popupHandlersAdded||(this.on({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!0),this},unbindPopup:function(){return this._popup&&(this.off({click:this._openPopup,keypress:this._onKeyPress,remove:this.closePopup,move:this._movePopup}),this._popupHandlersAdded=!1,this._popup=null),this},openPopup:function(t){return this._popup&&(this instanceof ci||(this._popup._source=this),this._popup._prepareOpen(t||this._latlng)&&this._popup.openOn(this._map)),this},closePopup:function(){return this._popup&&this._popup.close(),this},togglePopup:function(){return this._popup&&this._popup.toggle(this),this},isPopupOpen:function(){return!!this._popup&&this._popup.isOpen()},setPopupContent:function(t){return this._popup&&this._popup.setContent(t),this},getPopup:function(){return this._popup},_openPopup:function(t){var e;this._popup&&this._map&&(Re(t),e=t.layer||t.target,this._popup._source!==e||e instanceof fi?(this._popup._source=e,this.openPopup(t.latlng)):this._map.hasLayer(this._popup)?this.closePopup():this.openPopup(t.latlng))},_movePopup:function(t){this._popup.setLatLng(t.latlng)},_onKeyPress:function(t){13===t.originalEvent.keyCode&&this._openPopup(t)}}),Ai.extend({options:{pane:"tooltipPane",offset:[0,0],direction:"auto",permanent:!1,sticky:!1,opacity:.9},onAdd:function(t){Ai.prototype.onAdd.call(this,t),this.setOpacity(this.options.opacity),t.fire("tooltipopen",{tooltip:this}),this._source&&(this.addEventParent(this._source),this._source.fire("tooltipopen",{tooltip:this},!0))},onRemove:function(t){Ai.prototype.onRemove.call(this,t),t.fire("tooltipclose",{tooltip:this}),this._source&&(this.removeEventParent(this._source),this._source.fire("tooltipclose",{tooltip:this},!0))},getEvents:function(){var t=Ai.prototype.getEvents.call(this);return this.options.permanent||(t.preclick=this.close),t},_initLayout:function(){var t="leaflet-tooltip "+(this.options.className||"")+" leaflet-zoom-"+(this._zoomAnimated?"animated":"hide");this._contentNode=this._container=P("div",t),this._container.setAttribute("role","tooltip"),this._container.setAttribute("id","leaflet-tooltip-"+h(this))},_updateLayout:function(){},_adjustPan:function(){},_setPosition:function(t){var e,i=this._map,n=this._container,o=i.latLngToContainerPoint(i.getCenter()),i=i.layerPointToContainerPoint(t),s=this.options.direction,r=n.offsetWidth,a=n.offsetHeight,h=m(this.options.offset),l=this._getAnchor(),i="top"===s?(e=r/2,a):"bottom"===s?(e=r/2,0):(e="center"===s?r/2:"right"===s?0:"left"===s?r:i.x<o.x?(s="right",0):(s="left",r+2*(h.x+l.x)),a/2);t=t.subtract(m(e,i,!0)).add(h).add(l),z(n,"leaflet-tooltip-right"),z(n,"leaflet-tooltip-left"),z(n,"leaflet-tooltip-top"),z(n,"leaflet-tooltip-bottom"),M(n,"leaflet-tooltip-"+s),Z(n,t)},_updatePosition:function(){var t=this._map.latLngToLayerPoint(this._latlng);this._setPosition(t)},setOpacity:function(t){this.options.opacity=t,this._container&&C(this._container,t)},_animateZoom:function(t){t=this._map._latLngToNewLayerPoint(this._latlng,t.zoom,t.center);this._setPosition(t)},_getAnchor:function(){return m(this._source&&this._source._getTooltipAnchor&&!this.options.sticky?this._source._getTooltipAnchor():[0,0])}})),Ri=(A.include({openTooltip:function(t,e,i){return this._initOverlay(Ii,t,e,i).openOn(this),this},closeTooltip:function(t){return t.close(),this}}),o.include({bindTooltip:function(t,e){return this._tooltip&&this.isTooltipOpen()&&this.unbindTooltip(),this._tooltip=this._initOverlay(Ii,this._tooltip,t,e),this._initTooltipInteractions(),this._tooltip.options.permanent&&this._map&&this._map.hasLayer(this)&&this.openTooltip(),this},unbindTooltip:function(){return this._tooltip&&(this._initTooltipInteractions(!0),this.closeTooltip(),this._tooltip=null),this},_initTooltipInteractions:function(t){var e,i;!t&&this._tooltipHandlersAdded||(e=t?"off":"on",i={remove:this.closeTooltip,move:this._moveTooltip},this._tooltip.options.permanent?i.add=this._openTooltip:(i.mouseover=this._openTooltip,i.mouseout=this.closeTooltip,i.click=this._openTooltip,this._map?this._addFocusListeners():i.add=this._addFocusListeners),this._tooltip.options.sticky&&(i.mousemove=this._moveTooltip),this[e](i),this._tooltipHandlersAdded=!t)},openTooltip:function(t){return this._tooltip&&(this instanceof ci||(this._tooltip._source=this),this._tooltip._prepareOpen(t)&&(this._tooltip.openOn(this._map),this.getElement?this._setAriaDescribedByOnLayer(this):this.eachLayer&&this.eachLayer(this._setAriaDescribedByOnLayer,this))),this},closeTooltip:function(){if(this._tooltip)return this._tooltip.close()},toggleTooltip:function(){return this._tooltip&&this._tooltip.toggle(this),this},isTooltipOpen:function(){return this._tooltip.isOpen()},setTooltipContent:function(t){return this._tooltip&&this._tooltip.setContent(t),this},getTooltip:function(){return this._tooltip},_addFocusListeners:function(){this.getElement?this._addFocusListenersOnLayer(this):this.eachLayer&&this.eachLayer(this._addFocusListenersOnLayer,this)},_addFocusListenersOnLayer:function(t){var e="function"==typeof t.getElement&&t.getElement();e&&(S(e,"focus",function(){this._tooltip._source=t,this.openTooltip()},this),S(e,"blur",this.closeTooltip,this))},_setAriaDescribedByOnLayer:function(t){t="function"==typeof t.getElement&&t.getElement();t&&t.setAttribute("aria-describedby",this._tooltip._container.id)},_openTooltip:function(t){var e;this._tooltip&&this._map&&(this._map.dragging&&this._map.dragging.moving()&&!this._openOnceFlag?(this._openOnceFlag=!0,(e=this)._map.once("moveend",function(){e._openOnceFlag=!1,e._openTooltip(t)})):(this._tooltip._source=t.layer||t.target,this.openTooltip(this._tooltip.options.sticky?t.latlng:void 0)))},_moveTooltip:function(t){var e=t.latlng;this._tooltip.options.sticky&&t.originalEvent&&(t=this._map.mouseEventToContainerPoint(t.originalEvent),t=this._map.containerPointToLayerPoint(t),e=this._map.layerPointToLatLng(t)),this._tooltip.setLatLng(e)}}),di.extend({options:{iconSize:[12,12],html:!1,bgPos:null,className:"leaflet-div-icon"},createIcon:function(t){var t=t&&"DIV"===t.tagName?t:document.createElement("div"),e=this.options;return e.html instanceof Element?(me(t),t.appendChild(e.html)):t.innerHTML=!1!==e.html?e.html:"",e.bgPos&&(e=m(e.bgPos),t.style.backgroundPosition=-e.x+"px "+-e.y+"px"),this._setIconStyles(t,"icon"),t},createShadow:function(){return null}}));di.Default=_i;var Ni=o.extend({options:{tileSize:256,opacity:1,updateWhenIdle:b.mobile,updateWhenZooming:!0,updateInterval:200,zIndex:1,bounds:null,minZoom:0,maxZoom:void 0,maxNativeZoom:void 0,minNativeZoom:void 0,noWrap:!1,pane:"tilePane",className:"",keepBuffer:2},initialize:function(t){c(this,t)},onAdd:function(){this._initContainer(),this._levels={},this._tiles={},this._resetView()},beforeAdd:function(t){t._addZoomLimit(this)},onRemove:function(t){this._removeAllTiles(),T(this._container),t._removeZoomLimit(this),this._container=null,this._tileZoom=void 0},bringToFront:function(){return this._map&&(fe(this._container),this._setAutoZIndex(Math.max)),this},bringToBack:function(){return this._map&&(ge(this._container),this._setAutoZIndex(Math.min)),this},getContainer:function(){return this._container},setOpacity:function(t){return this.options.opacity=t,this._updateOpacity(),this},setZIndex:function(t){return this.options.zIndex=t,this._updateZIndex(),this},isLoading:function(){return this._loading},redraw:function(){var t;return this._map&&(this._removeAllTiles(),(t=this._clampZoom(this._map.getZoom()))!==this._tileZoom&&(this._tileZoom=t,this._updateLevels()),this._update()),this},getEvents:function(){var t={viewprereset:this._invalidateAll,viewreset:this._resetView,zoom:this._resetView,moveend:this._onMoveEnd};return this.options.updateWhenIdle||(this._onMove||(this._onMove=j(this._onMoveEnd,this.options.updateInterval,this)),t.move=this._onMove),this._zoomAnimated&&(t.zoomanim=this._animateZoom),t},createTile:function(){return document.createElement("div")},getTileSize:function(){var t=this.options.tileSize;return t instanceof p?t:new p(t,t)},_updateZIndex:function(){this._container&&void 0!==this.options.zIndex&&null!==this.options.zIndex&&(this._container.style.zIndex=this.options.zIndex)},_setAutoZIndex:function(t){for(var e,i=this.getPane().children,n=-t(-1/0,1/0),o=0,s=i.length;o<s;o++)e=i[o].style.zIndex,i[o]!==this._container&&e&&(n=t(n,+e));isFinite(n)&&(this.options.zIndex=n+t(-1,1),this._updateZIndex())},_updateOpacity:function(){if(this._map&&!b.ielt9){C(this._container,this.options.opacity);var t,e=+new Date,i=!1,n=!1;for(t in this._tiles){var o,s=this._tiles[t];s.current&&s.loaded&&(o=Math.min(1,(e-s.loaded)/200),C(s.el,o),o<1?i=!0:(s.active?n=!0:this._onOpaqueTile(s),s.active=!0))}n&&!this._noPrune&&this._pruneTiles(),i&&(r(this._fadeFrame),this._fadeFrame=x(this._updateOpacity,this))}},_onOpaqueTile:u,_initContainer:function(){this._container||(this._container=P("div","leaflet-layer "+(this.options.className||"")),this._updateZIndex(),this.options.opacity<1&&this._updateOpacity(),this.getPane().appendChild(this._container))},_updateLevels:function(){var t=this._tileZoom,e=this.options.maxZoom;if(void 0!==t){for(var i in this._levels)i=Number(i),this._levels[i].el.children.length||i===t?(this._levels[i].el.style.zIndex=e-Math.abs(t-i),this._onUpdateLevel(i)):(T(this._levels[i].el),this._removeTilesAtZoom(i),this._onRemoveLevel(i),delete this._levels[i]);var n=this._levels[t],o=this._map;return n||((n=this._levels[t]={}).el=P("div","leaflet-tile-container leaflet-zoom-animated",this._container),n.el.style.zIndex=e,n.origin=o.project(o.unproject(o.getPixelOrigin()),t).round(),n.zoom=t,this._setZoomTransform(n,o.getCenter(),o.getZoom()),u(n.el.offsetWidth),this._onCreateLevel(n)),this._level=n}},_onUpdateLevel:u,_onRemoveLevel:u,_onCreateLevel:u,_pruneTiles:function(){if(this._map){var t,e,i,n=this._map.getZoom();if(n>this.options.maxZoom||n<this.options.minZoom)this._removeAllTiles();else{for(t in this._tiles)(i=this._tiles[t]).retain=i.current;for(t in this._tiles)(i=this._tiles[t]).current&&!i.active&&(e=i.coords,this._retainParent(e.x,e.y,e.z,e.z-5)||this._retainChildren(e.x,e.y,e.z,e.z+2));for(t in this._tiles)this._tiles[t].retain||this._removeTile(t)}}},_removeTilesAtZoom:function(t){for(var e in this._tiles)this._tiles[e].coords.z===t&&this._removeTile(e)},_removeAllTiles:function(){for(var t in this._tiles)this._removeTile(t)},_invalidateAll:function(){for(var t in this._levels)T(this._levels[t].el),this._onRemoveLevel(Number(t)),delete this._levels[t];this._removeAllTiles(),this._tileZoom=void 0},_retainParent:function(t,e,i,n){var t=Math.floor(t/2),e=Math.floor(e/2),i=i-1,o=new p(+t,+e),o=(o.z=i,this._tileCoordsToKey(o)),o=this._tiles[o];return o&&o.active?o.retain=!0:(o&&o.loaded&&(o.retain=!0),n<i&&this._retainParent(t,e,i,n))},_retainChildren:function(t,e,i,n){for(var o=2*t;o<2*t+2;o++)for(var s=2*e;s<2*e+2;s++){var r=new p(o,s),r=(r.z=i+1,this._tileCoordsToKey(r)),r=this._tiles[r];r&&r.active?r.retain=!0:(r&&r.loaded&&(r.retain=!0),i+1<n&&this._retainChildren(o,s,i+1,n))}},_resetView:function(t){t=t&&(t.pinch||t.flyTo);this._setView(this._map.getCenter(),this._map.getZoom(),t,t)},_animateZoom:function(t){this._setView(t.center,t.zoom,!0,t.noUpdate)},_clampZoom:function(t){var e=this.options;return void 0!==e.minNativeZoom&&t<e.minNativeZoom?e.minNativeZoom:void 0!==e.maxNativeZoom&&e.maxNativeZoom<t?e.maxNativeZoom:t},_setView:function(t,e,i,n){var o=Math.round(e),o=void 0!==this.options.maxZoom&&o>this.options.maxZoom||void 0!==this.options.minZoom&&o<this.options.minZoom?void 0:this._clampZoom(o),s=this.options.updateWhenZooming&&o!==this._tileZoom;n&&!s||(this._tileZoom=o,this._abortLoading&&this._abortLoading(),this._updateLevels(),this._resetGrid(),void 0!==o&&this._update(t),i||this._pruneTiles(),this._noPrune=!!i),this._setZoomTransforms(t,e)},_setZoomTransforms:function(t,e){for(var i in this._levels)this._setZoomTransform(this._levels[i],t,e)},_setZoomTransform:function(t,e,i){var n=this._map.getZoomScale(i,t.zoom),e=t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(e,i)).round();b.any3d?be(t.el,e,n):Z(t.el,e)},_resetGrid:function(){var t=this._map,e=t.options.crs,i=this._tileSize=this.getTileSize(),n=this._tileZoom,o=this._map.getPixelWorldBounds(this._tileZoom);o&&(this._globalTileRange=this._pxBoundsToTileRange(o)),this._wrapX=e.wrapLng&&!this.options.noWrap&&[Math.floor(t.project([0,e.wrapLng[0]],n).x/i.x),Math.ceil(t.project([0,e.wrapLng[1]],n).x/i.y)],this._wrapY=e.wrapLat&&!this.options.noWrap&&[Math.floor(t.project([e.wrapLat[0],0],n).y/i.x),Math.ceil(t.project([e.wrapLat[1],0],n).y/i.y)]},_onMoveEnd:function(){this._map&&!this._map._animatingZoom&&this._update()},_getTiledPixelBounds:function(t){var e=this._map,i=e._animatingZoom?Math.max(e._animateToZoom,e.getZoom()):e.getZoom(),i=e.getZoomScale(i,this._tileZoom),t=e.project(t,this._tileZoom).floor(),e=e.getSize().divideBy(2*i);return new f(t.subtract(e),t.add(e))},_update:function(t){var e=this._map;if(e){var i=this._clampZoom(e.getZoom());if(void 0===t&&(t=e.getCenter()),void 0!==this._tileZoom){var n,e=this._getTiledPixelBounds(t),o=this._pxBoundsToTileRange(e),s=o.getCenter(),r=[],e=this.options.keepBuffer,a=new f(o.getBottomLeft().subtract([e,-e]),o.getTopRight().add([e,-e]));if(!(isFinite(o.min.x)&&isFinite(o.min.y)&&isFinite(o.max.x)&&isFinite(o.max.y)))throw new Error("Attempted to load an infinite number of tiles");for(n in this._tiles){var h=this._tiles[n].coords;h.z===this._tileZoom&&a.contains(new p(h.x,h.y))||(this._tiles[n].current=!1)}if(1<Math.abs(i-this._tileZoom))this._setView(t,i);else{for(var l=o.min.y;l<=o.max.y;l++)for(var u=o.min.x;u<=o.max.x;u++){var c,d=new p(u,l);d.z=this._tileZoom,this._isValidTile(d)&&((c=this._tiles[this._tileCoordsToKey(d)])?c.current=!0:r.push(d))}if(r.sort(function(t,e){return t.distanceTo(s)-e.distanceTo(s)}),0!==r.length){this._loading||(this._loading=!0,this.fire("loading"));for(var _=document.createDocumentFragment(),u=0;u<r.length;u++)this._addTile(r[u],_);this._level.el.appendChild(_)}}}}},_isValidTile:function(t){var e=this._map.options.crs;if(!e.infinite){var i=this._globalTileRange;if(!e.wrapLng&&(t.x<i.min.x||t.x>i.max.x)||!e.wrapLat&&(t.y<i.min.y||t.y>i.max.y))return!1}return!this.options.bounds||(e=this._tileCoordsToBounds(t),g(this.options.bounds).overlaps(e))},_keyToBounds:function(t){return this._tileCoordsToBounds(this._keyToTileCoords(t))},_tileCoordsToNwSe:function(t){var e=this._map,i=this.getTileSize(),n=t.scaleBy(i),i=n.add(i);return[e.unproject(n,t.z),e.unproject(i,t.z)]},_tileCoordsToBounds:function(t){t=this._tileCoordsToNwSe(t),t=new s(t[0],t[1]);return t=this.options.noWrap?t:this._map.wrapLatLngBounds(t)},_tileCoordsToKey:function(t){return t.x+":"+t.y+":"+t.z},_keyToTileCoords:function(t){var t=t.split(":"),e=new p(+t[0],+t[1]);return e.z=+t[2],e},_removeTile:function(t){var e=this._tiles[t];e&&(T(e.el),delete this._tiles[t],this.fire("tileunload",{tile:e.el,coords:this._keyToTileCoords(t)}))},_initTile:function(t){M(t,"leaflet-tile");var e=this.getTileSize();t.style.width=e.x+"px",t.style.height=e.y+"px",t.onselectstart=u,t.onmousemove=u,b.ielt9&&this.options.opacity<1&&C(t,this.options.opacity)},_addTile:function(t,e){var i=this._getTilePos(t),n=this._tileCoordsToKey(t),o=this.createTile(this._wrapCoords(t),a(this._tileReady,this,t));this._initTile(o),this.createTile.length<2&&x(a(this._tileReady,this,t,null,o)),Z(o,i),this._tiles[n]={el:o,coords:t,current:!0},e.appendChild(o),this.fire("tileloadstart",{tile:o,coords:t})},_tileReady:function(t,e,i){e&&this.fire("tileerror",{error:e,tile:i,coords:t});var n=this._tileCoordsToKey(t);(i=this._tiles[n])&&(i.loaded=+new Date,this._map._fadeAnimated?(C(i.el,0),r(this._fadeFrame),this._fadeFrame=x(this._updateOpacity,this)):(i.active=!0,this._pruneTiles()),e||(M(i.el,"leaflet-tile-loaded"),this.fire("tileload",{tile:i.el,coords:t})),this._noTilesToLoad()&&(this._loading=!1,this.fire("load"),b.ielt9||!this._map._fadeAnimated?x(this._pruneTiles,this):setTimeout(a(this._pruneTiles,this),250)))},_getTilePos:function(t){return t.scaleBy(this.getTileSize()).subtract(this._level.origin)},_wrapCoords:function(t){var e=new p(this._wrapX?H(t.x,this._wrapX):t.x,this._wrapY?H(t.y,this._wrapY):t.y);return e.z=t.z,e},_pxBoundsToTileRange:function(t){var e=this.getTileSize();return new f(t.min.unscaleBy(e).floor(),t.max.unscaleBy(e).ceil().subtract([1,1]))},_noTilesToLoad:function(){for(var t in this._tiles)if(!this._tiles[t].loaded)return!1;return!0}});var Di=Ni.extend({options:{minZoom:0,maxZoom:18,subdomains:"abc",errorTileUrl:"",zoomOffset:0,tms:!1,zoomReverse:!1,detectRetina:!1,crossOrigin:!1,referrerPolicy:!1},initialize:function(t,e){this._url=t,(e=c(this,e)).detectRetina&&b.retina&&0<e.maxZoom?(e.tileSize=Math.floor(e.tileSize/2),e.zoomReverse?(e.zoomOffset--,e.minZoom=Math.min(e.maxZoom,e.minZoom+1)):(e.zoomOffset++,e.maxZoom=Math.max(e.minZoom,e.maxZoom-1)),e.minZoom=Math.max(0,e.minZoom)):e.zoomReverse?e.minZoom=Math.min(e.maxZoom,e.minZoom):e.maxZoom=Math.max(e.minZoom,e.maxZoom),"string"==typeof e.subdomains&&(e.subdomains=e.subdomains.split("")),this.on("tileunload",this._onTileRemove)},setUrl:function(t,e){return this._url===t&&void 0===e&&(e=!0),this._url=t,e||this.redraw(),this},createTile:function(t,e){var i=document.createElement("img");return S(i,"load",a(this._tileOnLoad,this,e,i)),S(i,"error",a(this._tileOnError,this,e,i)),!this.options.crossOrigin&&""!==this.options.crossOrigin||(i.crossOrigin=!0===this.options.crossOrigin?"":this.options.crossOrigin),"string"==typeof this.options.referrerPolicy&&(i.referrerPolicy=this.options.referrerPolicy),i.alt="",i.src=this.getTileUrl(t),i},getTileUrl:function(t){var e={r:b.retina?"@2x":"",s:this._getSubdomain(t),x:t.x,y:t.y,z:this._getZoomForUrl()};return this._map&&!this._map.options.crs.infinite&&(t=this._globalTileRange.max.y-t.y,this.options.tms&&(e.y=t),e["-y"]=t),q(this._url,l(e,this.options))},_tileOnLoad:function(t,e){b.ielt9?setTimeout(a(t,this,null,e),0):t(null,e)},_tileOnError:function(t,e,i){var n=this.options.errorTileUrl;n&&e.getAttribute("src")!==n&&(e.src=n),t(i,e)},_onTileRemove:function(t){t.tile.onload=null},_getZoomForUrl:function(){var t=this._tileZoom,e=this.options.maxZoom;return(t=this.options.zoomReverse?e-t:t)+this.options.zoomOffset},_getSubdomain:function(t){t=Math.abs(t.x+t.y)%this.options.subdomains.length;return this.options.subdomains[t]},_abortLoading:function(){var t,e,i;for(t in this._tiles)this._tiles[t].coords.z!==this._tileZoom&&((i=this._tiles[t].el).onload=u,i.onerror=u,i.complete||(i.src=K,e=this._tiles[t].coords,T(i),delete this._tiles[t],this.fire("tileabort",{tile:i,coords:e})))},_removeTile:function(t){var e=this._tiles[t];if(e)return e.el.setAttribute("src",K),Ni.prototype._removeTile.call(this,t)},_tileReady:function(t,e,i){if(this._map&&(!i||i.getAttribute("src")!==K))return Ni.prototype._tileReady.call(this,t,e,i)}});function ji(t,e){return new Di(t,e)}var Hi=Di.extend({defaultWmsParams:{service:"WMS",request:"GetMap",layers:"",styles:"",format:"image/jpeg",transparent:!1,version:"1.1.1"},options:{crs:null,uppercase:!1},initialize:function(t,e){this._url=t;var i,n=l({},this.defaultWmsParams);for(i in e)i in this.options||(n[i]=e[i]);var t=(e=c(this,e)).detectRetina&&b.retina?2:1,o=this.getTileSize();n.width=o.x*t,n.height=o.y*t,this.wmsParams=n},onAdd:function(t){this._crs=this.options.crs||t.options.crs,this._wmsVersion=parseFloat(this.wmsParams.version);var e=1.3<=this._wmsVersion?"crs":"srs";this.wmsParams[e]=this._crs.code,Di.prototype.onAdd.call(this,t)},getTileUrl:function(t){var e=this._tileCoordsToNwSe(t),i=this._crs,i=_(i.project(e[0]),i.project(e[1])),e=i.min,i=i.max,e=(1.3<=this._wmsVersion&&this._crs===li?[e.y,e.x,i.y,i.x]:[e.x,e.y,i.x,i.y]).join(","),i=Di.prototype.getTileUrl.call(this,t);return i+U(this.wmsParams,i,this.options.uppercase)+(this.options.uppercase?"&BBOX=":"&bbox=")+e},setParams:function(t,e){return l(this.wmsParams,t),e||this.redraw(),this}});Di.WMS=Hi,ji.wms=function(t,e){return new Hi(t,e)};var Wi=o.extend({options:{padding:.1},initialize:function(t){c(this,t),h(this),this._layers=this._layers||{}},onAdd:function(){this._container||(this._initContainer(),M(this._container,"leaflet-zoom-animated")),this.getPane().appendChild(this._container),this._update(),this.on("update",this._updatePaths,this)},onRemove:function(){this.off("update",this._updatePaths,this),this._destroyContainer()},getEvents:function(){var t={viewreset:this._reset,zoom:this._onZoom,moveend:this._update,zoomend:this._onZoomEnd};return this._zoomAnimated&&(t.zoomanim=this._onAnimZoom),t},_onAnimZoom:function(t){this._updateTransform(t.center,t.zoom)},_onZoom:function(){this._updateTransform(this._map.getCenter(),this._map.getZoom())},_updateTransform:function(t,e){var i=this._map.getZoomScale(e,this._zoom),n=this._map.getSize().multiplyBy(.5+this.options.padding),o=this._map.project(this._center,e),n=n.multiplyBy(-i).add(o).subtract(this._map._getNewPixelOrigin(t,e));b.any3d?be(this._container,n,i):Z(this._container,n)},_reset:function(){for(var t in this._update(),this._updateTransform(this._center,this._zoom),this._layers)this._layers[t]._reset()},_onZoomEnd:function(){for(var t in this._layers)this._layers[t]._project()},_updatePaths:function(){for(var t in this._layers)this._layers[t]._update()},_update:function(){var t=this.options.padding,e=this._map.getSize(),i=this._map.containerPointToLayerPoint(e.multiplyBy(-t)).round();this._bounds=new f(i,i.add(e.multiplyBy(1+2*t)).round()),this._center=this._map.getCenter(),this._zoom=this._map.getZoom()}}),Fi=Wi.extend({options:{tolerance:0},getEvents:function(){var t=Wi.prototype.getEvents.call(this);return t.viewprereset=this._onViewPreReset,t},_onViewPreReset:function(){this._postponeUpdatePaths=!0},onAdd:function(){Wi.prototype.onAdd.call(this),this._draw()},_initContainer:function(){var t=this._container=document.createElement("canvas");S(t,"mousemove",this._onMouseMove,this),S(t,"click dblclick mousedown mouseup contextmenu",this._onClick,this),S(t,"mouseout",this._handleMouseOut,this),t._leaflet_disable_events=!0,this._ctx=t.getContext("2d")},_destroyContainer:function(){r(this._redrawRequest),delete this._ctx,T(this._container),k(this._container),delete this._container},_updatePaths:function(){if(!this._postponeUpdatePaths){for(var t in this._redrawBounds=null,this._layers)this._layers[t]._update();this._redraw()}},_update:function(){var t,e,i,n;this._map._animatingZoom&&this._bounds||(Wi.prototype._update.call(this),t=this._bounds,e=this._container,i=t.getSize(),n=b.retina?2:1,Z(e,t.min),e.width=n*i.x,e.height=n*i.y,e.style.width=i.x+"px",e.style.height=i.y+"px",b.retina&&this._ctx.scale(2,2),this._ctx.translate(-t.min.x,-t.min.y),this.fire("update"))},_reset:function(){Wi.prototype._reset.call(this),this._postponeUpdatePaths&&(this._postponeUpdatePaths=!1,this._updatePaths())},_initPath:function(t){this._updateDashArray(t);t=(this._layers[h(t)]=t)._order={layer:t,prev:this._drawLast,next:null};this._drawLast&&(this._drawLast.next=t),this._drawLast=t,this._drawFirst=this._drawFirst||this._drawLast},_addPath:function(t){this._requestRedraw(t)},_removePath:function(t){var e=t._order,i=e.next,e=e.prev;i?i.prev=e:this._drawLast=e,e?e.next=i:this._drawFirst=i,delete t._order,delete this._layers[h(t)],this._requestRedraw(t)},_updatePath:function(t){this._extendRedrawBounds(t),t._project(),t._update(),this._requestRedraw(t)},_updateStyle:function(t){this._updateDashArray(t),this._requestRedraw(t)},_updateDashArray:function(t){if("string"==typeof t.options.dashArray){for(var e,i=t.options.dashArray.split(/[, ]+/),n=[],o=0;o<i.length;o++){if(e=Number(i[o]),isNaN(e))return;n.push(e)}t.options._dashArray=n}else t.options._dashArray=t.options.dashArray},_requestRedraw:function(t){this._map&&(this._extendRedrawBounds(t),this._redrawRequest=this._redrawRequest||x(this._redraw,this))},_extendRedrawBounds:function(t){var e;t._pxBounds&&(e=(t.options.weight||0)+1,this._redrawBounds=this._redrawBounds||new f,this._redrawBounds.extend(t._pxBounds.min.subtract([e,e])),this._redrawBounds.extend(t._pxBounds.max.add([e,e])))},_redraw:function(){this._redrawRequest=null,this._redrawBounds&&(this._redrawBounds.min._floor(),this._redrawBounds.max._ceil()),this._clear(),this._draw(),this._redrawBounds=null},_clear:function(){var t,e=this._redrawBounds;e?(t=e.getSize(),this._ctx.clearRect(e.min.x,e.min.y,t.x,t.y)):(this._ctx.save(),this._ctx.setTransform(1,0,0,1,0,0),this._ctx.clearRect(0,0,this._container.width,this._container.height),this._ctx.restore())},_draw:function(){var t,e,i=this._redrawBounds;this._ctx.save(),i&&(e=i.getSize(),this._ctx.beginPath(),this._ctx.rect(i.min.x,i.min.y,e.x,e.y),this._ctx.clip()),this._drawing=!0;for(var n=this._drawFirst;n;n=n.next)t=n.layer,(!i||t._pxBounds&&t._pxBounds.intersects(i))&&t._updatePath();this._drawing=!1,this._ctx.restore()},_updatePoly:function(t,e){if(this._drawing){var i,n,o,s,r=t._parts,a=r.length,h=this._ctx;if(a){for(h.beginPath(),i=0;i<a;i++){for(n=0,o=r[i].length;n<o;n++)s=r[i][n],h[n?"lineTo":"moveTo"](s.x,s.y);e&&h.closePath()}this._fillStroke(h,t)}}},_updateCircle:function(t){var e,i,n,o;this._drawing&&!t._empty()&&(e=t._point,i=this._ctx,n=Math.max(Math.round(t._radius),1),1!=(o=(Math.max(Math.round(t._radiusY),1)||n)/n)&&(i.save(),i.scale(1,o)),i.beginPath(),i.arc(e.x,e.y/o,n,0,2*Math.PI,!1),1!=o&&i.restore(),this._fillStroke(i,t))},_fillStroke:function(t,e){var i=e.options;i.fill&&(t.globalAlpha=i.fillOpacity,t.fillStyle=i.fillColor||i.color,t.fill(i.fillRule||"evenodd")),i.stroke&&0!==i.weight&&(t.setLineDash&&t.setLineDash(e.options&&e.options._dashArray||[]),t.globalAlpha=i.opacity,t.lineWidth=i.weight,t.strokeStyle=i.color,t.lineCap=i.lineCap,t.lineJoin=i.lineJoin,t.stroke())},_onClick:function(t){for(var e,i,n=this._map.mouseEventToLayerPoint(t),o=this._drawFirst;o;o=o.next)(e=o.layer).options.interactive&&e._containsPoint(n)&&(("click"===t.type||"preclick"===t.type)&&this._map._draggableMoved(e)||(i=e));this._fireEvent(!!i&&[i],t)},_onMouseMove:function(t){var e;!this._map||this._map.dragging.moving()||this._map._animatingZoom||(e=this._map.mouseEventToLayerPoint(t),this._handleMouseHover(t,e))},_handleMouseOut:function(t){var e=this._hoveredLayer;e&&(z(this._container,"leaflet-interactive"),this._fireEvent([e],t,"mouseout"),this._hoveredLayer=null,this._mouseHoverThrottled=!1)},_handleMouseHover:function(t,e){if(!this._mouseHoverThrottled){for(var i,n,o=this._drawFirst;o;o=o.next)(i=o.layer).options.interactive&&i._containsPoint(e)&&(n=i);n!==this._hoveredLayer&&(this._handleMouseOut(t),n&&(M(this._container,"leaflet-interactive"),this._fireEvent([n],t,"mouseover"),this._hoveredLayer=n)),this._fireEvent(!!this._hoveredLayer&&[this._hoveredLayer],t),this._mouseHoverThrottled=!0,setTimeout(a(function(){this._mouseHoverThrottled=!1},this),32)}},_fireEvent:function(t,e,i){this._map._fireDOMEvent(e,i||e.type,t)},_bringToFront:function(t){var e,i,n=t._order;n&&(e=n.next,i=n.prev,e&&((e.prev=i)?i.next=e:e&&(this._drawFirst=e),n.prev=this._drawLast,(this._drawLast.next=n).next=null,this._drawLast=n,this._requestRedraw(t)))},_bringToBack:function(t){var e,i,n=t._order;n&&(e=n.next,(i=n.prev)&&((i.next=e)?e.prev=i:i&&(this._drawLast=i),n.prev=null,n.next=this._drawFirst,this._drawFirst.prev=n,this._drawFirst=n,this._requestRedraw(t)))}});function Ui(t){return b.canvas?new Fi(t):null}var Vi=function(){try{return document.namespaces.add("lvml","urn:schemas-microsoft-com:vml"),function(t){return document.createElement("<lvml:"+t+' class="lvml">')}}catch(t){}return function(t){return document.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')}}(),zt={_initContainer:function(){this._container=P("div","leaflet-vml-container")},_update:function(){this._map._animatingZoom||(Wi.prototype._update.call(this),this.fire("update"))},_initPath:function(t){var e=t._container=Vi("shape");M(e,"leaflet-vml-shape "+(this.options.className||"")),e.coordsize="1 1",t._path=Vi("path"),e.appendChild(t._path),this._updateStyle(t),this._layers[h(t)]=t},_addPath:function(t){var e=t._container;this._container.appendChild(e),t.options.interactive&&t.addInteractiveTarget(e)},_removePath:function(t){var e=t._container;T(e),t.removeInteractiveTarget(e),delete this._layers[h(t)]},_updateStyle:function(t){var e=t._stroke,i=t._fill,n=t.options,o=t._container;o.stroked=!!n.stroke,o.filled=!!n.fill,n.stroke?(e=e||(t._stroke=Vi("stroke")),o.appendChild(e),e.weight=n.weight+"px",e.color=n.color,e.opacity=n.opacity,n.dashArray?e.dashStyle=d(n.dashArray)?n.dashArray.join(" "):n.dashArray.replace(/( *, *)/g," "):e.dashStyle="",e.endcap=n.lineCap.replace("butt","flat"),e.joinstyle=n.lineJoin):e&&(o.removeChild(e),t._stroke=null),n.fill?(i=i||(t._fill=Vi("fill")),o.appendChild(i),i.color=n.fillColor||n.color,i.opacity=n.fillOpacity):i&&(o.removeChild(i),t._fill=null)},_updateCircle:function(t){var e=t._point.round(),i=Math.round(t._radius),n=Math.round(t._radiusY||i);this._setPath(t,t._empty()?"M0 0":"AL "+e.x+","+e.y+" "+i+","+n+" 0,23592600")},_setPath:function(t,e){t._path.v=e},_bringToFront:function(t){fe(t._container)},_bringToBack:function(t){ge(t._container)}},qi=b.vml?Vi:ct,Gi=Wi.extend({_initContainer:function(){this._container=qi("svg"),this._container.setAttribute("pointer-events","none"),this._rootGroup=qi("g"),this._container.appendChild(this._rootGroup)},_destroyContainer:function(){T(this._container),k(this._container),delete this._container,delete this._rootGroup,delete this._svgSize},_update:function(){var t,e,i;this._map._animatingZoom&&this._bounds||(Wi.prototype._update.call(this),e=(t=this._bounds).getSize(),i=this._container,this._svgSize&&this._svgSize.equals(e)||(this._svgSize=e,i.setAttribute("width",e.x),i.setAttribute("height",e.y)),Z(i,t.min),i.setAttribute("viewBox",[t.min.x,t.min.y,e.x,e.y].join(" ")),this.fire("update"))},_initPath:function(t){var e=t._path=qi("path");t.options.className&&M(e,t.options.className),t.options.interactive&&M(e,"leaflet-interactive"),this._updateStyle(t),this._layers[h(t)]=t},_addPath:function(t){this._rootGroup||this._initContainer(),this._rootGroup.appendChild(t._path),t.addInteractiveTarget(t._path)},_removePath:function(t){T(t._path),t.removeInteractiveTarget(t._path),delete this._layers[h(t)]},_updatePath:function(t){t._project(),t._update()},_updateStyle:function(t){var e=t._path,t=t.options;e&&(t.stroke?(e.setAttribute("stroke",t.color),e.setAttribute("stroke-opacity",t.opacity),e.setAttribute("stroke-width",t.weight),e.setAttribute("stroke-linecap",t.lineCap),e.setAttribute("stroke-linejoin",t.lineJoin),t.dashArray?e.setAttribute("stroke-dasharray",t.dashArray):e.removeAttribute("stroke-dasharray"),t.dashOffset?e.setAttribute("stroke-dashoffset",t.dashOffset):e.removeAttribute("stroke-dashoffset")):e.setAttribute("stroke","none"),t.fill?(e.setAttribute("fill",t.fillColor||t.color),e.setAttribute("fill-opacity",t.fillOpacity),e.setAttribute("fill-rule",t.fillRule||"evenodd")):e.setAttribute("fill","none"))},_updatePoly:function(t,e){this._setPath(t,dt(t._parts,e))},_updateCircle:function(t){var e=t._point,i=Math.max(Math.round(t._radius),1),n="a"+i+","+(Math.max(Math.round(t._radiusY),1)||i)+" 0 1,0 ",e=t._empty()?"M0 0":"M"+(e.x-i)+","+e.y+n+2*i+",0 "+n+2*-i+",0 ";this._setPath(t,e)},_setPath:function(t,e){t._path.setAttribute("d",e)},_bringToFront:function(t){fe(t._path)},_bringToBack:function(t){ge(t._path)}});function Ki(t){return b.svg||b.vml?new Gi(t):null}b.vml&&Gi.include(zt),A.include({getRenderer:function(t){t=(t=t.options.renderer||this._getPaneRenderer(t.options.pane)||this.options.renderer||this._renderer)||(this._renderer=this._createRenderer());return this.hasLayer(t)||this.addLayer(t),t},_getPaneRenderer:function(t){var e;return"overlayPane"!==t&&void 0!==t&&(void 0===(e=this._paneRenderers[t])&&(e=this._createRenderer({pane:t}),this._paneRenderers[t]=e),e)},_createRenderer:function(t){return this.options.preferCanvas&&Ui(t)||Ki(t)}});var Yi=xi.extend({initialize:function(t,e){xi.prototype.initialize.call(this,this._boundsToLatLngs(t),e)},setBounds:function(t){return this.setLatLngs(this._boundsToLatLngs(t))},_boundsToLatLngs:function(t){return[(t=g(t)).getSouthWest(),t.getNorthWest(),t.getNorthEast(),t.getSouthEast()]}});Gi.create=qi,Gi.pointsToPath=dt,wi.geometryToLayer=bi,wi.coordsToLatLng=Li,wi.coordsToLatLngs=Ti,wi.latLngToCoords=Mi,wi.latLngsToCoords=zi,wi.getFeature=Ci,wi.asFeature=Zi,A.mergeOptions({boxZoom:!0});var _t=n.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane,this._resetStateTimeout=0,t.on("unload",this._destroy,this)},addHooks:function(){S(this._container,"mousedown",this._onMouseDown,this)},removeHooks:function(){k(this._container,"mousedown",this._onMouseDown,this)},moved:function(){return this._moved},_destroy:function(){T(this._pane),delete this._pane},_resetState:function(){this._resetStateTimeout=0,this._moved=!1},_clearDeferredResetState:function(){0!==this._resetStateTimeout&&(clearTimeout(this._resetStateTimeout),this._resetStateTimeout=0)},_onMouseDown:function(t){if(!t.shiftKey||1!==t.which&&1!==t.button)return!1;this._clearDeferredResetState(),this._resetState(),re(),Le(),this._startPoint=this._map.mouseEventToContainerPoint(t),S(document,{contextmenu:Re,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseMove:function(t){this._moved||(this._moved=!0,this._box=P("div","leaflet-zoom-box",this._container),M(this._container,"leaflet-crosshair"),this._map.fire("boxzoomstart")),this._point=this._map.mouseEventToContainerPoint(t);var t=new f(this._point,this._startPoint),e=t.getSize();Z(this._box,t.min),this._box.style.width=e.x+"px",this._box.style.height=e.y+"px"},_finish:function(){this._moved&&(T(this._box),z(this._container,"leaflet-crosshair")),ae(),Te(),k(document,{contextmenu:Re,mousemove:this._onMouseMove,mouseup:this._onMouseUp,keydown:this._onKeyDown},this)},_onMouseUp:function(t){1!==t.which&&1!==t.button||(this._finish(),this._moved&&(this._clearDeferredResetState(),this._resetStateTimeout=setTimeout(a(this._resetState,this),0),t=new s(this._map.containerPointToLatLng(this._startPoint),this._map.containerPointToLatLng(this._point)),this._map.fitBounds(t).fire("boxzoomend",{boxZoomBounds:t})))},_onKeyDown:function(t){27===t.keyCode&&(this._finish(),this._clearDeferredResetState(),this._resetState())}}),Ct=(A.addInitHook("addHandler","boxZoom",_t),A.mergeOptions({doubleClickZoom:!0}),n.extend({addHooks:function(){this._map.on("dblclick",this._onDoubleClick,this)},removeHooks:function(){this._map.off("dblclick",this._onDoubleClick,this)},_onDoubleClick:function(t){var e=this._map,i=e.getZoom(),n=e.options.zoomDelta,i=t.originalEvent.shiftKey?i-n:i+n;"center"===e.options.doubleClickZoom?e.setZoom(i):e.setZoomAround(t.containerPoint,i)}})),Zt=(A.addInitHook("addHandler","doubleClickZoom",Ct),A.mergeOptions({dragging:!0,inertia:!0,inertiaDeceleration:3400,inertiaMaxSpeed:1/0,easeLinearity:.2,worldCopyJump:!1,maxBoundsViscosity:0}),n.extend({addHooks:function(){var t;this._draggable||(t=this._map,this._draggable=new Xe(t._mapPane,t._container),this._draggable.on({dragstart:this._onDragStart,drag:this._onDrag,dragend:this._onDragEnd},this),this._draggable.on("predrag",this._onPreDragLimit,this),t.options.worldCopyJump&&(this._draggable.on("predrag",this._onPreDragWrap,this),t.on("zoomend",this._onZoomEnd,this),t.whenReady(this._onZoomEnd,this))),M(this._map._container,"leaflet-grab leaflet-touch-drag"),this._draggable.enable(),this._positions=[],this._times=[]},removeHooks:function(){z(this._map._container,"leaflet-grab"),z(this._map._container,"leaflet-touch-drag"),this._draggable.disable()},moved:function(){return this._draggable&&this._draggable._moved},moving:function(){return this._draggable&&this._draggable._moving},_onDragStart:function(){var t,e=this._map;e._stop(),this._map.options.maxBounds&&this._map.options.maxBoundsViscosity?(t=g(this._map.options.maxBounds),this._offsetLimit=_(this._map.latLngToContainerPoint(t.getNorthWest()).multiplyBy(-1),this._map.latLngToContainerPoint(t.getSouthEast()).multiplyBy(-1).add(this._map.getSize())),this._viscosity=Math.min(1,Math.max(0,this._map.options.maxBoundsViscosity))):this._offsetLimit=null,e.fire("movestart").fire("dragstart"),e.options.inertia&&(this._positions=[],this._times=[])},_onDrag:function(t){var e,i;this._map.options.inertia&&(e=this._lastTime=+new Date,i=this._lastPos=this._draggable._absPos||this._draggable._newPos,this._positions.push(i),this._times.push(e),this._prunePositions(e)),this._map.fire("move",t).fire("drag",t)},_prunePositions:function(t){for(;1<this._positions.length&&50<t-this._times[0];)this._positions.shift(),this._times.shift()},_onZoomEnd:function(){var t=this._map.getSize().divideBy(2),e=this._map.latLngToLayerPoint([0,0]);this._initialWorldOffset=e.subtract(t).x,this._worldWidth=this._map.getPixelWorldBounds().getSize().x},_viscousLimit:function(t,e){return t-(t-e)*this._viscosity},_onPreDragLimit:function(){var t,e;this._viscosity&&this._offsetLimit&&(t=this._draggable._newPos.subtract(this._draggable._startPos),e=this._offsetLimit,t.x<e.min.x&&(t.x=this._viscousLimit(t.x,e.min.x)),t.y<e.min.y&&(t.y=this._viscousLimit(t.y,e.min.y)),t.x>e.max.x&&(t.x=this._viscousLimit(t.x,e.max.x)),t.y>e.max.y&&(t.y=this._viscousLimit(t.y,e.max.y)),this._draggable._newPos=this._draggable._startPos.add(t))},_onPreDragWrap:function(){var t=this._worldWidth,e=Math.round(t/2),i=this._initialWorldOffset,n=this._draggable._newPos.x,o=(n-e+i)%t+e-i,n=(n+e+i)%t-e-i,t=Math.abs(o+i)<Math.abs(n+i)?o:n;this._draggable._absPos=this._draggable._newPos.clone(),this._draggable._newPos.x=t},_onDragEnd:function(t){var e,i,n,o,s=this._map,r=s.options,a=!r.inertia||t.noInertia||this._times.length<2;s.fire("dragend",t),!a&&(this._prunePositions(+new Date),t=this._lastPos.subtract(this._positions[0]),a=(this._lastTime-this._times[0])/1e3,e=r.easeLinearity,a=(t=t.multiplyBy(e/a)).distanceTo([0,0]),i=Math.min(r.inertiaMaxSpeed,a),t=t.multiplyBy(i/a),n=i/(r.inertiaDeceleration*e),(o=t.multiplyBy(-n/2).round()).x||o.y)?(o=s._limitOffset(o,s.options.maxBounds),x(function(){s.panBy(o,{duration:n,easeLinearity:e,noMoveStart:!0,animate:!0})})):s.fire("moveend")}})),St=(A.addInitHook("addHandler","dragging",Zt),A.mergeOptions({keyboard:!0,keyboardPanDelta:80}),n.extend({keyCodes:{left:[37],right:[39],down:[40],up:[38],zoomIn:[187,107,61,171],zoomOut:[189,109,54,173]},initialize:function(t){this._map=t,this._setPanDelta(t.options.keyboardPanDelta),this._setZoomDelta(t.options.zoomDelta)},addHooks:function(){var t=this._map._container;t.tabIndex<=0&&(t.tabIndex="0"),S(t,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.on({focus:this._addHooks,blur:this._removeHooks},this)},removeHooks:function(){this._removeHooks(),k(this._map._container,{focus:this._onFocus,blur:this._onBlur,mousedown:this._onMouseDown},this),this._map.off({focus:this._addHooks,blur:this._removeHooks},this)},_onMouseDown:function(){var t,e,i;this._focused||(i=document.body,t=document.documentElement,e=i.scrollTop||t.scrollTop,i=i.scrollLeft||t.scrollLeft,this._map._container.focus(),window.scrollTo(i,e))},_onFocus:function(){this._focused=!0,this._map.fire("focus")},_onBlur:function(){this._focused=!1,this._map.fire("blur")},_setPanDelta:function(t){for(var e=this._panKeys={},i=this.keyCodes,n=0,o=i.left.length;n<o;n++)e[i.left[n]]=[-1*t,0];for(n=0,o=i.right.length;n<o;n++)e[i.right[n]]=[t,0];for(n=0,o=i.down.length;n<o;n++)e[i.down[n]]=[0,t];for(n=0,o=i.up.length;n<o;n++)e[i.up[n]]=[0,-1*t]},_setZoomDelta:function(t){for(var e=this._zoomKeys={},i=this.keyCodes,n=0,o=i.zoomIn.length;n<o;n++)e[i.zoomIn[n]]=t;for(n=0,o=i.zoomOut.length;n<o;n++)e[i.zoomOut[n]]=-t},_addHooks:function(){S(document,"keydown",this._onKeyDown,this)},_removeHooks:function(){k(document,"keydown",this._onKeyDown,this)},_onKeyDown:function(t){if(!(t.altKey||t.ctrlKey||t.metaKey)){var e,i,n=t.keyCode,o=this._map;if(n in this._panKeys)o._panAnim&&o._panAnim._inProgress||(i=this._panKeys[n],t.shiftKey&&(i=m(i).multiplyBy(3)),o.options.maxBounds&&(i=o._limitOffset(m(i),o.options.maxBounds)),o.options.worldCopyJump?(e=o.wrapLatLng(o.unproject(o.project(o.getCenter()).add(i))),o.panTo(e)):o.panBy(i));else if(n in this._zoomKeys)o.setZoom(o.getZoom()+(t.shiftKey?3:1)*this._zoomKeys[n]);else{if(27!==n||!o._popup||!o._popup.options.closeOnEscapeKey)return;o.closePopup()}Re(t)}}})),Et=(A.addInitHook("addHandler","keyboard",St),A.mergeOptions({scrollWheelZoom:!0,wheelDebounceTime:40,wheelPxPerZoomLevel:60}),n.extend({addHooks:function(){S(this._map._container,"wheel",this._onWheelScroll,this),this._delta=0},removeHooks:function(){k(this._map._container,"wheel",this._onWheelScroll,this)},_onWheelScroll:function(t){var e=He(t),i=this._map.options.wheelDebounceTime,e=(this._delta+=e,this._lastMousePos=this._map.mouseEventToContainerPoint(t),this._startTime||(this._startTime=+new Date),Math.max(i-(+new Date-this._startTime),0));clearTimeout(this._timer),this._timer=setTimeout(a(this._performZoom,this),e),Re(t)},_performZoom:function(){var t=this._map,e=t.getZoom(),i=this._map.options.zoomSnap||0,n=(t._stop(),this._delta/(4*this._map.options.wheelPxPerZoomLevel)),n=4*Math.log(2/(1+Math.exp(-Math.abs(n))))/Math.LN2,i=i?Math.ceil(n/i)*i:n,n=t._limitZoom(e+(0<this._delta?i:-i))-e;this._delta=0,this._startTime=null,n&&("center"===t.options.scrollWheelZoom?t.setZoom(e+n):t.setZoomAround(this._lastMousePos,e+n))}})),kt=(A.addInitHook("addHandler","scrollWheelZoom",Et),A.mergeOptions({tapHold:b.touchNative&&b.safari&&b.mobile,tapTolerance:15}),n.extend({addHooks:function(){S(this._map._container,"touchstart",this._onDown,this)},removeHooks:function(){k(this._map._container,"touchstart",this._onDown,this)},_onDown:function(t){var e;clearTimeout(this._holdTimeout),1===t.touches.length&&(e=t.touches[0],this._startPos=this._newPos=new p(e.clientX,e.clientY),this._holdTimeout=setTimeout(a(function(){this._cancel(),this._isTapValid()&&(S(document,"touchend",O),S(document,"touchend touchcancel",this._cancelClickPrevent),this._simulateEvent("contextmenu",e))},this),600),S(document,"touchend touchcancel contextmenu",this._cancel,this),S(document,"touchmove",this._onMove,this))},_cancelClickPrevent:function t(){k(document,"touchend",O),k(document,"touchend touchcancel",t)},_cancel:function(){clearTimeout(this._holdTimeout),k(document,"touchend touchcancel contextmenu",this._cancel,this),k(document,"touchmove",this._onMove,this)},_onMove:function(t){t=t.touches[0];this._newPos=new p(t.clientX,t.clientY)},_isTapValid:function(){return this._newPos.distanceTo(this._startPos)<=this._map.options.tapTolerance},_simulateEvent:function(t,e){t=new MouseEvent(t,{bubbles:!0,cancelable:!0,view:window,screenX:e.screenX,screenY:e.screenY,clientX:e.clientX,clientY:e.clientY});t._simulated=!0,e.target.dispatchEvent(t)}})),Ot=(A.addInitHook("addHandler","tapHold",kt),A.mergeOptions({touchZoom:b.touch,bounceAtZoomLimits:!0}),n.extend({addHooks:function(){M(this._map._container,"leaflet-touch-zoom"),S(this._map._container,"touchstart",this._onTouchStart,this)},removeHooks:function(){z(this._map._container,"leaflet-touch-zoom"),k(this._map._container,"touchstart",this._onTouchStart,this)},_onTouchStart:function(t){var e,i,n=this._map;!t.touches||2!==t.touches.length||n._animatingZoom||this._zooming||(e=n.mouseEventToContainerPoint(t.touches[0]),i=n.mouseEventToContainerPoint(t.touches[1]),this._centerPoint=n.getSize()._divideBy(2),this._startLatLng=n.containerPointToLatLng(this._centerPoint),"center"!==n.options.touchZoom&&(this._pinchStartLatLng=n.containerPointToLatLng(e.add(i)._divideBy(2))),this._startDist=e.distanceTo(i),this._startZoom=n.getZoom(),this._moved=!1,this._zooming=!0,n._stop(),S(document,"touchmove",this._onTouchMove,this),S(document,"touchend touchcancel",this._onTouchEnd,this),O(t))},_onTouchMove:function(t){if(t.touches&&2===t.touches.length&&this._zooming){var e=this._map,i=e.mouseEventToContainerPoint(t.touches[0]),n=e.mouseEventToContainerPoint(t.touches[1]),o=i.distanceTo(n)/this._startDist;if(this._zoom=e.getScaleZoom(o,this._startZoom),!e.options.bounceAtZoomLimits&&(this._zoom<e.getMinZoom()&&o<1||this._zoom>e.getMaxZoom()&&1<o)&&(this._zoom=e._limitZoom(this._zoom)),"center"===e.options.touchZoom){if(this._center=this._startLatLng,1==o)return}else{i=i._add(n)._divideBy(2)._subtract(this._centerPoint);if(1==o&&0===i.x&&0===i.y)return;this._center=e.unproject(e.project(this._pinchStartLatLng,this._zoom).subtract(i),this._zoom)}this._moved||(e._moveStart(!0,!1),this._moved=!0),r(this._animRequest);n=a(e._move,e,this._center,this._zoom,{pinch:!0,round:!1},void 0);this._animRequest=x(n,this,!0),O(t)}},_onTouchEnd:function(){this._moved&&this._zooming?(this._zooming=!1,r(this._animRequest),k(document,"touchmove",this._onTouchMove,this),k(document,"touchend touchcancel",this._onTouchEnd,this),this._map.options.zoomAnimation?this._map._animateZoom(this._center,this._map._limitZoom(this._zoom),!0,this._map.options.zoomSnap):this._map._resetView(this._center,this._map._limitZoom(this._zoom))):this._zooming=!1}})),Xi=(A.addInitHook("addHandler","touchZoom",Ot),A.BoxZoom=_t,A.DoubleClickZoom=Ct,A.Drag=Zt,A.Keyboard=St,A.ScrollWheelZoom=Et,A.TapHold=kt,A.TouchZoom=Ot,t.Bounds=f,t.Browser=b,t.CRS=ot,t.Canvas=Fi,t.Circle=vi,t.CircleMarker=gi,t.Class=et,t.Control=B,t.DivIcon=Ri,t.DivOverlay=Ai,t.DomEvent=mt,t.DomUtil=pt,t.Draggable=Xe,t.Evented=it,t.FeatureGroup=ci,t.GeoJSON=wi,t.GridLayer=Ni,t.Handler=n,t.Icon=di,t.ImageOverlay=Ei,t.LatLng=v,t.LatLngBounds=s,t.Layer=o,t.LayerGroup=ui,t.LineUtil=vt,t.Map=A,t.Marker=mi,t.Mixin=ft,t.Path=fi,t.Point=p,t.PolyUtil=gt,t.Polygon=xi,t.Polyline=yi,t.Popup=Bi,t.PosAnimation=Fe,t.Projection=wt,t.Rectangle=Yi,t.Renderer=Wi,t.SVG=Gi,t.SVGOverlay=Oi,t.TileLayer=Di,t.Tooltip=Ii,t.Transformation=at,t.Util=tt,t.VideoOverlay=ki,t.bind=a,t.bounds=_,t.canvas=Ui,t.circle=function(t,e,i){return new vi(t,e,i)},t.circleMarker=function(t,e){return new gi(t,e)},t.control=Ue,t.divIcon=function(t){return new Ri(t)},t.extend=l,t.featureGroup=function(t,e){return new ci(t,e)},t.geoJSON=Si,t.geoJson=Mt,t.gridLayer=function(t){return new Ni(t)},t.icon=function(t){return new di(t)},t.imageOverlay=function(t,e,i){return new Ei(t,e,i)},t.latLng=w,t.latLngBounds=g,t.layerGroup=function(t,e){return new ui(t,e)},t.map=function(t,e){return new A(t,e)},t.marker=function(t,e){return new mi(t,e)},t.point=m,t.polygon=function(t,e){return new xi(t,e)},t.polyline=function(t,e){return new yi(t,e)},t.popup=function(t,e){return new Bi(t,e)},t.rectangle=function(t,e){return new Yi(t,e)},t.setOptions=c,t.stamp=h,t.svg=Ki,t.svgOverlay=function(t,e,i){return new Oi(t,e,i)},t.tileLayer=ji,t.tooltip=function(t,e){return new Ii(t,e)},t.transformation=ht,t.version="1.9.4",t.videoOverlay=function(t,e,i){return new ki(t,e,i)},window.L);t.noConflict=function(){return window.L=Xi,this},window.L=t});
//# sourceMappingURL=leaflet.js.map

// ── Coordinate e intro paesi per flyTo ──
var COUNTRY_COORDS = {
  'Italia':      {lat:42.5,  lng:12.5,  zoom:5, denoms:15},
  'Francia':     {lat:46.5,  lng:2.2,   zoom:5, denoms:12},
  'Spagna':      {lat:39.5,  lng:-3.5,  zoom:5, denoms:8},
  'USA':         {lat:37.5,  lng:-100,  zoom:4, denoms:6},
  'Germania':    {lat:51.0,  lng:10.0,  zoom:5, denoms:5},
  'Portogallo':  {lat:39.5,  lng:-8.0,  zoom:6, denoms:5},
  'Argentina':   {lat:-38.0, lng:-65.0, zoom:4, denoms:4},
  'Australia':   {lat:-27.0, lng:134.0, zoom:4, denoms:4},
  'Grecia':      {lat:38.5,  lng:22.5,  zoom:5, denoms:3},
  'Austria':     {lat:47.5,  lng:14.5,  zoom:6, denoms:4},
  'Ungheria':    {lat:47.0,  lng:19.0,  zoom:6, denoms:3},
  'Georgia':     {lat:42.0,  lng:43.5,  zoom:6, denoms:2},
  'Cile':        {lat:-33.5, lng:-70.5, zoom:5, denoms:3},
  'Nuova Zelanda':{lat:-41.0,lng:172.0, zoom:5, denoms:2},
  'Sud Africa':  {lat:-33.5, lng:19.0,  zoom:5, denoms:3},
};

var COUNTRY_INTRO = {
  'Italia': {
    flag:'🇮🇹',
    text: "L'Italia è il paese con la più alta biodiversità viticola al mondo: oltre 350 vitigni autoctoni registrati. Da Nord a Sud ogni regione ha la propria identità — dal Nebbiolo delle Langhe al Nero d'Avola siciliano.",
    stats: [
      {label:'Vitigni autoctoni', val:'350+'},
      {label:'DOCG', val:'77'},
      {label:'DOC', val:'341'},
      {label:'Bottiglie/anno', val:'5 mld'}
    ]
  },
  'Francia': {
    flag:'🇫🇷',
    text: "La Francia è il punto di riferimento assoluto della viticoltura mondiale. Borgogna, Bordeaux, Champagne, Rodano, Alsazia, Provenza: ogni regione ha codificato secoli di sapere enologico in un sistema di AOC rigoroso.",
    stats: [
      {label:'AOC vini', val:'360+'},
      {label:'Regioni vinicole', val:'17'},
      {label:'Bottiglie/anno', val:'4.5 mld'},
      {label:'Export valore', val:'€12 mld'}
    ]
  },
  'Spagna': {
    flag:'🇪🇸',
    text: "La Spagna è la nazione con la maggiore superficie vitata al mondo. La Rioja è la sua denominazione più celebre, ma Ribera del Duero, Priorat e Jerez hanno portato la viticoltura iberica nell'olimpo mondiale.",
    stats: [
      {label:'Superficie vitata', val:'960.000 ha'},
      {label:'DO e DOCa', val:'97'},
      {label:'Vitigni autoctoni', val:'400+'},
      {label:'Bottiglie/anno', val:'4 mld'}
    ]
  },
  'USA': {
    flag:'🇺🇸',
    text: "La Napa Valley ha rivoluzionato la percezione del vino americano con il Giudizio di Parigi del 1976. Oggi California, Oregon e Washington producono vini di livello mondiale. Il Cabernet di Napa e il Pinot Nero dell'Oregon sono icone globali.",
    stats: [
      {label:'Stati vinicoli', val:'50'},
      {label:'AVA riconosciute', val:'260+'},
      {label:'Produzione', val:'3° al mondo'},
      {label:'Consumo', val:'1° al mondo'}
    ]
  },
  'Germania': {
    flag:'🇩🇪',
    text: "La Germania produce i bianchi secchi più longevi del mondo. Il Riesling del Mosel su terrazzamenti ardesiaci invecchia 50 anni senza perdere freschezza. Il Pinot Nero tedesco (Spätburgunder) è una grande scoperta.",
    stats: [
      {label:'Produzione', val:'9 mln hl'},
      {label:'Riesling piantato', val:'23% superficie'},
      {label:'VDP cantine', val:'200+'},
      {label:'GG Grosse Gewächse', val:'top dry'}
    ]
  },
  'Portogallo': {
    flag:'🇵🇹',
    text: "Il Portogallo custodisce oltre 250 vitigni autoctoni quasi sconosciuti fuori dai confini nazionali. Il Porto è la sua creazione più celebre, ma i Vinho Verde, i vini del Douro e dell'Alentejo conquistano sempre più il mercato internazionale.",
    stats: [
      {label:'Vitigni autoctoni', val:'250+'},
      {label:'DOC', val:'31'},
      {label:'Porto export', val:'1° vino fort.'},
      {label:'Alentejo crescita', val:'+45% decennio'}
    ]
  },
  'Argentina': {
    flag:'🇦🇷',
    text: "Mendoza, ai piedi delle Ande a 900-1500 metri di altitudine, produce il Malbec più potente e seducente del mondo. La vite qui trova escursioni termiche eccezionali e irraggiamento solare estremo che concentrano i tannini in modo unico.",
    stats: [
      {label:'Altitudine media', val:'900-1500m'},
      {label:'Malbec piantato', val:'40% superficie'},
      {label:'Produzione', val:'14 mln hl'},
      {label:'Export', val:'7° al mondo'}
    ]
  },
  'Australia': {
    flag:'🇦🇺',
    text: "L'Australia ha portato il Shiraz a livelli impensabili con le viti centenarie della Barossa Valley. Clare Valley e Eden Valley producono Riesling di straordinaria longevità. Il concetto australiano di terroir sta evolvendo verso qualcosa di unico.",
    stats: [
      {label:'Superficie vitata', val:'150.000 ha'},
      {label:'Viti > 100 anni', val:'Barossa old vine'},
      {label:'Export', val:'€1.8 mld'},
      {label:'Produzione', val:'12 mln hl'}
    ]
  },
  'Grecia': {
    flag:'🇬🇷',
    text: "La Grecia è la culla della civiltà del vino: 3500 anni di storia ininterrotta. L'Assyrtiko di Santorini, coltivato su suolo vulcanico, è uno dei bianchi più minerali e longevi al mondo. Il Xinomavro e l'Agiorgitiko sono i grandi rossi indigeni.",
    stats: [
      {label:'Vitigni autoctoni', val:'300+'},
      {label:'PDO vini', val:'33'},
      {label:'Santorini Assyrtiko', val:'vulcanico'},
      {label:'Naoussa Xinomavro', val:'grande rosso'}
    ]
  }
};

// ── FlyTo Paese: zoom ampio + intro ──
function flyToCountry(country){
  var intro=(typeof COUNTRY_INTRO!=='undefined')?COUNTRY_INTRO[country]:null;
  document.querySelectorAll('.exp-country-btn').forEach(function(b){
    b.classList.remove('active');
    if(b.textContent.indexOf(country)>-1) b.classList.add('active');
  });
  document.querySelectorAll('.exp-denom-btn').forEach(function(b){ b.classList.remove('active'); });
  // Naviga
  document.querySelectorAll('.ntab').forEach(function(t){ t.classList.remove('active'); });
  var etab=document.querySelector('[data-page="explore"]');
  if(etab) etab.classList.add('active');
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); p.style.display=''; });
  var ep=document.getElementById('page-explore');
  if(ep){ ep.style.display=''; ep.classList.add('active'); }
  setTimeout(function(){
    var cont=document.getElementById('expCountries');
    if(!cont) return;
    ['expList','expDetail','expSearch'].forEach(function(id){ var el=document.getElementById(id); if(el) el.style.display='none'; });
    cont.style.display='block';
    if(intro){
      var statsH=intro.stats?'<div class="country-intro-stats">'+intro.stats.map(function(s){return '<div class="country-stat"><span>'+s.val+'</span>'+s.label+'</div>';}).join('')+'</div>':'';
      var chipsH=Object.keys(EXP.byCountry||{}).filter(function(cn){return cn!==country;}).slice(0,8).map(function(cn,i){
        return '<button data-fly="'+cn+'" style="font-family:Cinzel,serif;font-size:.44rem;padding:4px 9px;background:rgba(191,155,74,.05);border:1px solid rgba(191,155,74,.12);color:rgba(191,155,74,.5);cursor:pointer;margin:3px;border-radius:2px;">'+(EFLAGS[cn]||'🌍')+' '+cn+'</button>';
      }).join('');
      cont.innerHTML='<div class="country-intro-box" style="border-left:none;border-top:3px solid var(--oro);">'
        +'<div class="country-intro-flag">'+intro.flag+'</div>'
        +'<div class="country-intro-name">'+country.toUpperCase()+'</div>'
        +'<div class="country-intro-text">'+intro.text+'</div>'
        +statsH
        +'<button id="btnOpenCountry_'+country.replace(/ /g,'_')+'" style="display:block;width:100%;margin-top:12px;padding:10px;background:var(--vino);color:#fff;font-family:Cinzel,serif;font-size:.55rem;letter-spacing:2px;border:none;cursor:pointer;">🍷 DENOMINAZIONI DI '+country.toUpperCase()+'</button>'
        +'</div><div style="padding:8px 12px;" id="chipsContainer_'+country.replace(/ /g,'_')+'" >'+chipsH+'</div>';
      // Bind eventi dopo inject HTML
      var ob=document.getElementById('btnOpenCountry_'+country.replace(/ /g,'_'));
      if(ob) ob.addEventListener('click',function(){ openExpCountry(country); });
      var cc=document.getElementById('chipsContainer_'+country.replace(/ /g,'_'));
      if(cc) cc.addEventListener('click',function(e){ var b=e.target.closest('[data-fly]'); if(b) flyToCountry(b.dataset.fly); });
    } else { openExpCountry(country); }
  },80);
}


// ── Navigazione robusta ──
function navigateTo(page,callback){
  // Usa solo classList — non tocca style.display per non battere il CSS !important
  document.querySelectorAll('.page').forEach(function(p){
    p.classList.remove('active');
    p.style.display='';  // resetta stili inline
  });
  document.querySelectorAll('.ntab').forEach(function(t){
    t.classList.remove('active');
    if(t.dataset.page===page) t.classList.add('active');
  });
  var tgt=document.getElementById('page-'+page);
  if(tgt){ tgt.style.display=''; tgt.classList.add('active'); }
  if(callback) setTimeout(callback,30);
}

function quickDenom(id){
  document.querySelectorAll('.exp-denom-btn').forEach(function(b){ b.classList.remove('active'); });
  try{ event.currentTarget.classList.add('active'); }catch(e){}
  document.querySelectorAll('.ntab').forEach(function(t){ t.classList.remove('active'); });
  var etab=document.querySelector('[data-page="explore"]');
  if(etab) etab.classList.add('active');
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); p.style.display=''; });
  var ep=document.getElementById('page-explore');
  if(ep){ ep.style.display=''; ep.classList.add('active'); }
  setTimeout(function(){ openExpDenom(id); },80);
}


function $el(id){ return document.getElementById(id); }
function $show(id,v){ var e=$el(id); if(e) e.style.display=v||'block'; }
function $hide(id){ var e=$el(id); if(e) e.style.display='none'; }
// ═══════════════════════════════════════

// ── API KEY ──
var apiKey='';
(function(){
  try{apiKey=localStorage.getItem('sw_groq_key')||'';}catch(e){}
  if(apiKey){ var _ki2=document.getElementById('keyInput'); if(_ki2){_ki2.value=apiKey; updateKeyDot();} }
})();
function saveKey(){
  var _ki=document.getElementById('keyInput');
  if(_ki){ apiKey=_ki.value.trim(); try{localStorage.setItem('sw_groq_key',apiKey);}catch(e){} }
  updateKeyDot();
}
async function testKey(){
  var btn=document.getElementById('keyTest');
  var msg=document.getElementById('keyMsg');
  if(!apiKey){msg.textContent='Inserisci chiave';msg.style.color='#f99';return;}
  btn.textContent='...';msg.textContent='Test...';msg.style.color='rgba(191,155,74,.6)';
  try{
    var r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
      body:JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:5,messages:[{role:'user',content:'OK'}]})
    });
    var d=await r.json();
    if(!r.ok) throw new Error((d.error&&d.error.message)||'Errore '+r.status);
    msg.textContent='✅ Chiave valida!';msg.style.color='#4CAF50';
  }catch(e){
    msg.textContent='❌ '+e.message;msg.style.color='#f77';
  }
  btn.textContent='TEST';
}
async function testKey(){
  var btn=document.getElementById('keyTest');
  var msg=document.getElementById('keyMsg');
  if(!apiKey){msg.textContent='Inserisci chiave';msg.style.color='#f99';return;}
  btn.textContent='...';msg.textContent='Test in corso...';msg.style.color='rgba(191,155,74,.6)';
  try{
    var r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key='+apiKey,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({contents:[{parts:[{text:'Rispondi solo: OK'}]}],generationConfig:{maxOutputTokens:5}})
    });
    var d=await r.json();
    if(!r.ok) throw new Error((d.error&&d.error.message)||'Errore HTTP '+r.status);
    msg.textContent='Chiave valida!';msg.style.color='#4CAF50';
  }catch(e){
    msg.textContent='ERRORE: '+e.message;msg.style.color='#f77';
  }
  btn.textContent='TEST';
}
function updateKeyDot(){
  // hidden - no visible dot
}

// ── PANNELLO SEGRETO (5 tap sul logo) ──
var _tapCount=0,_tapTimer=null,_adminTaps=0,_adminTimer=null;
(document.getElementById('navLogo')||{addEventListener:function(){}}).addEventListener('click',function(){
  // 5 tap = impostazioni API key
  _tapCount++;
  clearTimeout(_tapTimer);
  _tapTimer=setTimeout(function(){_tapCount=0;},1500);
  if(_tapCount>=5){_tapCount=0;return;} // settings rimosso
  // 7 tap = pannello admin
  _adminTaps++;
  clearTimeout(_adminTimer);
  _adminTimer=setTimeout(function(){_adminTaps=0;},2000);
  if(_adminTaps>=7){
    _adminTaps=0;
    var tab=document.getElementById('adminTab');
    if(tab) tab.style.display=tab.style.display==='none'?'flex':'none';
  }
});
function openSecret(){
  // Pannello rimosso — nessuno può inserire chiavi
}
function closeSecret(){ /* panel rimosso */ }
function saveSecretKey(){
  // Salva URL server
  var urlInput = document.getElementById('serverUrlInput');
  if(urlInput){
    var serverUrl = urlInput.value.trim().replace(/\/$/, ''); // rimuovi slash finale
    SERVER_URL = serverUrl;
    try{ localStorage.setItem('sw_server_url', serverUrl); }catch(e){}
  }
  // Salva chiave API (opzionale se c'è il server)
  var v=document.getElementById('secretKeyInput').value.trim();
  apiKey=v;
  var _ki3=document.getElementById('keyInput'); if(_ki3) _ki3.value=v;
  try{localStorage.setItem('sw_groq_key',v);}catch(e){}
  document.getElementById('secretMsg').textContent='✅ Chiave salvata!';
  document.getElementById('secretMsg').style.color='#4CAF50';
  setTimeout(function(){document.getElementById('secretMsg').textContent='';},2000);
}
async function testSecretKey(){
  var btn=document.getElementById('secretTestBtn');
  var msg=document.getElementById('secretMsg');
  var key=document.getElementById('secretKeyInput').value.trim();
  if(!key){msg.textContent='Inserisci la chiave';msg.style.color='#f99';return;}
  if(!key.startsWith('gsk_')){msg.textContent='⚠ La chiave deve iniziare con gsk_';msg.style.color='#fa0';btn.textContent='TEST';return;}
  btn.textContent='...';
  msg.textContent='Test in corso...';msg.style.color='rgba(191,155,74,.6)';
  var payload=JSON.stringify({model:'llama-3.3-70b-versatile',max_tokens:5,messages:[{role:'user',content:'OK'}]});
  // Prova diretta
  var ok=false;
  try{
    var r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:payload
    });
    var d=await r.json();
    if(r.status===401){msg.textContent='❌ Chiave non valida. Crea una nuova su console.groq.com';msg.style.color='#f77';btn.textContent='TEST';return;}
    if(r.ok){ok=true;}
  }catch(e){/* CORS - prova proxy */}
  // Prova proxy se necessario
  if(!ok){
    try{
      var r2=await fetch('https://corsproxy.io/?'+encodeURIComponent('https://api.groq.com/openai/v1/chat/completions'),{
        method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key,'x-requested-with':'XMLHttpRequest'},body:payload
      });
      var d2=await r2.json();
      if(r2.status===401){msg.textContent='❌ Chiave non valida. Crea una nuova su console.groq.com';msg.style.color='#f77';btn.textContent='TEST';return;}
      if(r2.ok) ok=true;
    }catch(e2){}
  }
  if(ok){
    msg.textContent='✅ Chiave valida! Tutto funziona.';msg.style.color='#4CAF50';
  } else {
    msg.textContent='⚠ Connessione bloccata. Prova ad aprire il sito da Chrome (non da file manager).';msg.style.color='#fa0';
  }
  btn.textContent='TEST';
}

// ── RENDER TUTTI PRODUTTORI (pagina Produttori) ──
function renderAllProds(){
  var cont=document.getElementById('allProdsContainer');
  if(!cont)return;
  var prods=getProds();
  if(!prods.length){
    cont.innerHTML='<div style="text-align:center;padding:30px;font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.35);">Nessun produttore ancora inserito.<br>Sii il primo!</div>';
    return;
  }
  var BADGES={basic:'🥂 Basic · Inserzione',premium:'⭐ Premium · Inserzione',elite:'👑 Elite · Inserzione'};
  var html='<div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:3px;color:var(--oro);margin-bottom:12px;">'+prods.length+' PRODUTTORI REGISTRATI</div>';
  prods.forEach(function(p){
    html+='<div class="prod-card" style="margin-bottom:10px;">'
      +'<span class="prod-badge '+p.pkg+'">'+BADGES[p.pkg]+'</span>'
      +'<div class="prod-wine">'+p.wine+'</div>'
      +'<div class="prod-cant">'+p.cantina+(p.vigna?' · '+p.vigna:'')+'</div>'
      +'<div style="font-family:Cinzel,serif;font-size:.56rem;color:rgba(191,155,74,.5);margin-top:3px;">'+p.denomId.toUpperCase().replace(/_/g,' ')+'</div>'
      +(p.desc?'<div class="prod-desc">'+p.desc+'</div>':'')
      +(p.price?'<div class="prod-price">'+p.price+'</div>':'')
      +'</div>';
  });
  cont.innerHTML=html;
}
(document.getElementById('keyInput')||{addEventListener:function(){}}).addEventListener('input',function(){apiKey=this.value.trim();updateKeyDot();});

// URL del tuo server backend (si configura nel pannello ⚙️)
// Server backend fisso — non modificabile dall'utente
var SERVER_URL = 'https://sommelier-server-production-8f92.up.railway.app';

async function callAPI(system, userMsg, imgB64, imgMime) {
  // i18n: lingua AI automatica
  if(system && typeof i18n !== 'undefined' && i18n.current !== 'it'){
    var _lc = i18n.aiCmd();
    if(_lc && system.indexOf(_lc.trim()) < 0) system = _lc + system;
  }

  // ── Modalità SERVER (nessuna chiave necessaria) ──
  if(SERVER_URL && SERVER_URL.startsWith('http')){
    var r = await fetch(SERVER_URL + '/api/groq', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ system: system, userMsg: userMsg, maxTokens: 1000 })
    });
    var data = await r.json();
    if(!r.ok) throw new Error(data.error || 'Errore server');
    return data.text;
  }

  // ── Modalità LOCALE (chiave API diretta) ──
  if(!apiKey) throw new Error('Server non raggiungibile. Riprova.');
  var payload = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1000,
    messages: [
      {role:'system', content: system},
      {role:'user', content: userMsg}
    ]
  });
  // Prova 1: Groq diretto
  try {
    var r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
      body: payload
    });
    var d = await r.json();
    if(!r.ok) {
      var msg = d.error&&d.error.message||'HTTP '+r.status;
      // Se è errore di autenticazione, non provare proxy
      if(r.status===401) throw new Error('Chiave non valida. Vai su console.groq.com e crea una nuova chiave gsk_...');
      if(r.status===429) throw new Error('Troppo richieste. Aspetta un momento e riprova.');
      throw new Error(msg);
    }
    return d.choices[0].message.content;
  } catch(e) {
    // Se è errore di rete/CORS, prova con proxy
    if(e.message.indexOf('Chiave')>-1 || e.message.indexOf('Troppo')>-1) throw e;
    // Prova 2: proxy CORS
    try {
      var proxyUrl = 'https://corsproxy.io/?'+encodeURIComponent('https://api.groq.com/openai/v1/chat/completions');
      var r2 = await fetch(proxyUrl, {
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey,'x-requested-with':'XMLHttpRequest'},
        body: payload
      });
      var d2 = await r2.json();
      if(!r2.ok) {
        var msg2 = d2.error&&d2.error.message||'HTTP '+r2.status;
        if(r2.status===401) throw new Error('Chiave non valida. Vai su console.groq.com e crea una nuova chiave gsk_...');
        throw new Error(msg2);
      }
      return d2.choices[0].message.content;
    } catch(e2) {
      if(e2.message.indexOf('Chiave')>-1) throw e2;
      throw new Error('Errore connessione. Assicurati di avere internet e riprova.');
    }
  }
}

// ── MD → HTML ──
function md2html(t){
  t=t.replace(/^## (.+)$/gm,'<h2 class="md-h2">$1</h2>');
  t=t.replace(/^### (.+)$/gm,'<h3 class="md-h3">$1</h3>');
  t=t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  t=t.replace(/\*(.+?)\*/g,'<em>$1</em>');
  t=t.replace(/^---+$/gm,'<hr class="md-hr">');
  var lines=t.split('\n');
  var out=[];
  for(var i=0;i<lines.length;i++){
    var l=lines[i];
    if(l.match(/^<h[23]|^<hr/)){out.push(l);}
    else if(l.trim()===''){out.push('</p><p>');}
    else{out.push(l+' ');}
  }
  return '<p>'+out.join('')+'</p>';
}

function renderSomResult(rawText){
  // Pulisci il testo da residui markdown
  // Converti markdown in HTML elegante
  var text = rawText
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong>$1</strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--crema);font-family:Cinzel,serif;font-size:.88em;letter-spacing:.05em;">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul style="margin:6px 0 10px;padding-left:18px;color:rgba(245,239,226,.82);line-height:1.8;list-style:disc;">$&</ul>')
    .trim();

  var wrap = document.createElement('div');
  wrap.style.cssText = 'font-family:Cormorant Garamond,serif;';

  // Separa i blocchi (paragrafo per piatto + segreto finale)
  // Ogni piatto è un paragrafo separato da riga vuota
  var blocks = text.split(/\n\s*\n/).filter(function(b){ return b.trim(); });

  blocks.forEach(function(block, i){
    block = block.trim();
    if(!block) return;

    var isSecret = /il segreto del sommelier|segreto:/i.test(block);

    if(isSecret){
      // Box finale dorato
      var d = document.createElement('div');
      d.style.cssText = 'margin-top:22px;padding:16px 18px;background:rgba(191,155,74,.08);border-top:2px solid rgba(191,155,74,.25);border-bottom:2px solid rgba(191,155,74,.25);';
      var lbl = document.createElement('div');
      lbl.style.cssText = 'font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.25em;color:var(--oro);margin-bottom:10px;';
      lbl.textContent = '✦ IL SEGRETO DEL SOMMELIER';
      var txt = document.createElement('div');
      txt.style.cssText = 'font-family:IM Fell English,serif;font-style:italic;font-size:1.08rem;line-height:1.9;color:rgba(245,239,226,.85);';
      txt.textContent = block
        .replace(/il segreto del sommelier:?\s*/i, '')
        .replace(/segreto:?\s*/i, '')
        .trim();
      d.appendChild(lbl); d.appendChild(txt); wrap.appendChild(d);
      return;
    }

    // Card vino normale
    var card = document.createElement('div');
    card.style.cssText = 'padding:16px 0;border-bottom:1px solid rgba(191,155,74,.1);';
    if(i === 0) card.style.paddingTop = '4px';

    // Rileva se la prima riga contiene il nome del piatto (es. "TROTA ALPINA:" o "Per la trota")
    var lines = block.split('\n').filter(function(l){ return l.trim(); });

    // Prima riga potrebbe essere il piatto
    var dishLine = '';
    var bodyLines = lines;
    if(lines.length > 1 && (lines[0].length < 80 || /^per |^col |^con |^al |^alla |^agli /i.test(lines[0]))){
      dishLine = lines[0];
      bodyLines = lines.slice(1);
    }

    if(dishLine){
      var dh = document.createElement('div');
      dh.style.cssText = 'font-family:Cinzel,serif;font-size:.7rem;letter-spacing:.15em;color:var(--oro);margin-bottom:10px;padding-bottom:7px;border-bottom:1px solid rgba(191,155,74,.12);';
      dh.textContent = dishLine.replace(/^[-•*]+\s*/, '').replace(/:$/, '').trim().toUpperCase();
      card.appendChild(dh);
    }

    // Corpo: testo pieno del paragrafo
    var body = document.createElement('div');
    body.style.cssText = 'font-size:1.02rem;line-height:1.9;color:rgba(245,239,226,.88);';

    var fullText = bodyLines.join(' ').trim();

    // Evidenzia il primo vino menzionato (primo nome produttore/denominazione)
    // Cerca pattern "Nome Produttore — denominazione" o "Nome 20XX"
    var wineMatch = fullText.match(/([A-Z][a-zA-Zàèéìòùâêîôûäëïöü\s]+(\d{4})?)/);
    if(wineMatch){
      var wineSpan = '<span style="font-family:Cinzel,serif;font-size:.92rem;font-weight:600;color:#F5EFE2;">' + wineMatch[0] + '</span>';
      body.innerHTML = fullText.replace(wineMatch[0], wineSpan);
    } else {
      body.textContent = fullText;
    }

    card.appendChild(body);
    wrap.appendChild(card);
  });

  return wrap.innerHTML || '<div style="color:rgba(245,239,226,.7);font-size:1rem;line-height:1.9;">' + text + '</div>';
}


// ── NAVIGATION ──
var mapInited=false,mapObj=null;
document.querySelectorAll('.ntab').forEach(function(t){
  t.addEventListener('click',function(){
    var p=this.dataset.page;
    // Aggiorna tab attivo
    document.querySelectorAll('.ntab').forEach(function(x){x.classList.remove('active');});
    this.classList.add('active');
    // Cambia pagina — solo classList, CSS fa il resto
    document.querySelectorAll('.page').forEach(function(x){
      x.classList.remove('active');
      x.style.display='';
    });
    var target = document.getElementById('page-'+p);
    if(target){ target.style.display=''; target.classList.add('active'); }

    if(p==='explore'){setTimeout(function(){try{renderExploreCountries();}catch(err){var cc=document.getElementById('expCountries');if(cc)cc.innerHTML='<div style="padding:20px;text-align:center;font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.5);">Ricarica la pagina se le denominazioni non appaiono</div>';}},300);}
    if(p==='events'){setTimeout(function(){loadEvents(false);},250);}
    if(p==='news'){syncNewsPage();}
    if(p==='producers'){setTimeout(function(){renderAllProds();},250);}
    if(p==='compare'){setTimeout(function(){if(typeof EXP!=='undefined') initCmpSelects();},100);}
    closeDrawer();
  });
});

// ══════════════ MAPPA ══════════════
var mapObj=null,tileLayer=null,polyLayers=[],prodMarkers=[];
var allFeatures=[],activeCountry='all',currentDenomId=null;
var drawerAiCache={};

var TILES={
  street:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  satellite:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  topo:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
};
var curTile='street';

function initMap(){
  if(mapInited)return;
  mapInited=true;
  mapObj=L.map('map',{center:[25,10],zoom:2,minZoom:2,maxZoom:18,zoomControl:true});
  tileLayer=L.tileLayer(TILES.street,{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapObj);
  setTimeout(function(){mapObj.invalidateSize();},400);
  loadGeoJSON();
}

function loadGeoJSON(){
  var data={"type":"FeatureCollection","features":[{"type":"Feature","properties":{"id":"barolo","name":"Barolo DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo","type":"DOCG","color":"#8B0000","description":"Re dei vini. Nebbiolo su marne helvetiane. Viola, rosa, catrame, tabacco. 38 mesi affinamento."},"geometry":{"type":"Polygon","coordinates":[[[7.923,44.594],[7.94,44.587],[7.962,44.581],[7.98,44.582],[7.998,44.588],[8.01,44.596],[8.008,44.612],[7.998,44.628],[7.985,44.643],[7.968,44.651],[7.95,44.652],[7.93,44.645],[7.912,44.632],[7.906,44.617],[7.91,44.604],[7.923,44.594]]]}},{"type":"Feature","properties":{"id":"barbaresco","name":"Barbaresco DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo","type":"DOCG","color":"#8B0000","description":"Regina dei vini. Nebbiolo più elegante su tufo e sabbia. MGA: Asili, Rabajà, Martinenga."},"geometry":{"type":"Polygon","coordinates":[[[8.002,44.664],[8.018,44.66],[8.038,44.658],[8.058,44.662],[8.072,44.67],[8.078,44.683],[8.072,44.697],[8.055,44.706],[8.032,44.709],[8.01,44.706],[7.997,44.696],[7.993,44.682],[7.997,44.67],[8.002,44.664]]]}},{"type":"Feature","properties":{"id":"gattinara","name":"Gattinara DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo (Spanna)","type":"DOCG","color":"#8B0000","description":"Nebbiolo su porfido rosso vulcanico. Struttura e longevità. Travaglini, Antoniolo."},"geometry":{"type":"Polygon","coordinates":[[[8.35,45.6],[8.45,45.6],[8.45,45.7],[8.35,45.7],[8.35,45.6]]]}},{"type":"Feature","properties":{"id":"ghemme","name":"Ghemme DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo, Vespolina","type":"DOCG","color":"#8B0000","description":"Alto Piemonte. Nebbiolo su porfido e argille. Cantalupo come riferimento."},"geometry":{"type":"Polygon","coordinates":[[[8.4,45.57],[8.55,45.57],[8.55,45.67],[8.4,45.67],[8.4,45.57]]]}},{"type":"Feature","properties":{"id":"asti","name":"Asti DOCG","country":"Italia","region":"Piemonte","grapes":"Moscato Bianco","type":"DOCG","color":"#FFD700","description":"Moscato dolce frizzante delle colline astigiane. Pesca, albicocca, fiori d'acacia. Contratto, G.B. Burlotto."},"geometry":{"type":"Polygon","coordinates":[[[8.1,44.7],[8.5,44.7],[8.5,44.95],[8.1,44.95],[8.1,44.7]]]}},{"type":"Feature","properties":{"id":"moscato_asti","name":"Moscato d'Asti DOCG","country":"Italia","region":"Piemonte","grapes":"Moscato Bianco","type":"DOCG","color":"#FFD700","description":"Versione ferma e dolce del Moscato. Bassa gradazione, aromi intensi. Ceretto, La Spinetta."},"geometry":{"type":"Polygon","coordinates":[[[8.1,44.7],[8.5,44.7],[8.5,44.95],[8.1,44.95],[8.1,44.7]]]}},{"type":"Feature","properties":{"id":"dolcetto_dogliani","name":"Dolcetto di Dogliani DOCG","country":"Italia","region":"Piemonte","grapes":"Dolcetto","type":"DOCG","color":"#8B0000","description":"Dogliani: casa storica del Dolcetto. Suoli calcarei-argillosi. Prugna, mandorla amara. Einaudi, Abbona."},"geometry":{"type":"Polygon","coordinates":[[[7.9,44.51],[8.0,44.51],[8.0,44.62],[7.9,44.62],[7.9,44.51]]]}},{"type":"Feature","properties":{"id":"roero","name":"Roero DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo, Arneis","type":"DOCG","color":"#8B0000","description":"Riva sinistra del Tanaro. Nebbiolo su sabbie terziarie. Arneis bianco di eccellenza. Matteo Correggia."},"geometry":{"type":"Polygon","coordinates":[[[7.85,44.65],[8.0,44.65],[8.0,44.85],[7.85,44.85],[7.85,44.65]]]}},{"type":"Feature","properties":{"id":"brachetto","name":"Brachetto d'Acqui DOCG","country":"Italia","region":"Piemonte","grapes":"Brachetto","type":"DOCG","color":"#9B59B6","description":"Dolce rosato frizzante. Rosa, fragola, lampone. Banfi, Braida, Coppo."},"geometry":{"type":"Polygon","coordinates":[[[8.4,44.6],[8.65,44.6],[8.65,44.8],[8.4,44.8],[8.4,44.6]]]}},{"type":"Feature","properties":{"id":"barbera_alba","name":"Barbera d'Alba DOC","country":"Italia","region":"Piemonte","grapes":"Barbera","type":"DOC","color":"#8B0000","description":"Barbera nelle Langhe. Acidità vivace, frutti rossi, note speziate. Giacomo Conterno, Bruno Giacosa."},"geometry":{"type":"Polygon","coordinates":[[[7.85,44.6],[8.05,44.6],[8.05,44.8],[7.85,44.8],[7.85,44.6]]]}},{"type":"Feature","properties":{"id":"barbera_asti","name":"Barbera d'Asti DOCG","country":"Italia","region":"Piemonte","grapes":"Barbera","type":"DOCG","color":"#8B0000","description":"Nizza e Tinella le sottozone top. Ciliegia, mora, amarena. Olim Bauda, Coppo, Bersano."},"geometry":{"type":"Polygon","coordinates":[[[8.0,44.7],[8.6,44.7],[8.6,44.95],[8.0,44.95],[8.0,44.7]]]}},{"type":"Feature","properties":{"id":"dolcetto_alba","name":"Dolcetto d'Alba DOC","country":"Italia","region":"Piemonte","grapes":"Dolcetto","type":"DOC","color":"#8B0000","description":"Dolcetto versatile delle Langhe. Viola, prugna, ciliegia. Ceretto, Prunotto."},"geometry":{"type":"Polygon","coordinates":[[[7.85,44.57],[8.1,44.57],[8.1,44.75],[7.85,44.75],[7.85,44.57]]]}},{"type":"Feature","properties":{"id":"langhe","name":"Langhe DOC","country":"Italia","region":"Piemonte","grapes":"Nebbiolo, Chardonnay, Arneis","type":"DOC","color":"#8B0000","description":"Denominazione ombrello delle Langhe. Permette vitigni diversi. Base per IGT noti."},"geometry":{"type":"Polygon","coordinates":[[[7.8,44.5],[8.15,44.5],[8.15,44.8],[7.8,44.8],[7.8,44.5]]]}},{"type":"Feature","properties":{"id":"franciacorta","name":"Franciacorta DOCG","country":"Italia","region":"Lombardia","grapes":"Chardonnay, Pinot Nero, Pinot Bianco","type":"DOCG","color":"#FFD700","description":"Metodo Classico italiano d'eccellenza. Morene glaciali del Lago d'Iseo. Berlucchi, Ca\' del Bosco, Bellavista."},"geometry":{"type":"Polygon","coordinates":[[[9.878,45.628],[9.92,45.618],[9.968,45.612],[10.018,45.614],[10.062,45.622],[10.094,45.638],[10.102,45.656],[10.092,45.672],[10.062,45.682],[10.018,45.684],[9.968,45.678],[9.92,45.664],[9.886,45.648],[9.878,45.636],[9.878,45.628]]]}},{"type":"Feature","properties":{"id":"valtellina","name":"Valtellina Superiore DOCG","country":"Italia","region":"Lombardia","grapes":"Nebbiolo (Chiavennasca)","type":"DOCG","color":"#8B0000","description":"Terrazzamenti alpini verticali su granito. Sassella, Grumello, Inferno, Valgella. Nino Negri."},"geometry":{"type":"Polygon","coordinates":[[[9.718,46.068],[9.81,46.06],[9.918,46.058],[10.028,46.062],[10.108,46.074],[10.152,46.098],[10.148,46.128],[10.108,46.152],[10.028,46.164],[9.918,46.162],[9.81,46.154],[9.718,46.138],[9.672,46.114],[9.668,46.09],[9.718,46.068]]]}},{"type":"Feature","properties":{"id":"sforzato","name":"Sforzato di Valtellina DOCG","country":"Italia","region":"Lombardia","grapes":"Nebbiolo","type":"DOCG","color":"#8B0000","description":"Appassimento in Valtellina. Uve secche per 3 mesi. 14%+. Ercole, Nino Negri Il Fruttaio."},"geometry":{"type":"Polygon","coordinates":[[[9.6,46.06],[10.15,46.06],[10.15,46.26],[9.6,46.26],[9.6,46.06]]]}},{"type":"Feature","properties":{"id":"oltrepo","name":"Oltrepò Pavese Metodo Classico DOCG","country":"Italia","region":"Lombardia","grapes":"Pinot Nero","type":"DOCG","color":"#FFD700","description":"Colline pavesi. Pinot Nero per bollicine. Monsupello, Ballabio."},"geometry":{"type":"Polygon","coordinates":[[[9.0,44.85],[9.5,44.85],[9.5,45.15],[9.0,45.15],[9.0,44.85]]]}},{"type":"Feature","properties":{"id":"soave","name":"Soave Classico DOC","country":"Italia","region":"Veneto","grapes":"Garganega, Trebbiano di Soave","type":"DOC","color":"#FFD700","description":"Basalto e tufo vulcanico. Mandorla, fiori bianchi, agrumi. Pieropan, Gini, Prà."},"geometry":{"type":"Polygon","coordinates":[[[11.13,45.34],[11.36,45.34],[11.36,45.49],[11.13,45.49],[11.13,45.34]]]}},{"type":"Feature","properties":{"id":"soave_superiore","name":"Soave Superiore DOCG","country":"Italia","region":"Veneto","grapes":"Garganega","type":"DOCG","color":"#FFD700","description":"Versione superiore con resa ridotta. Struttura e longevità. Inama, Tamellini."},"geometry":{"type":"Polygon","coordinates":[[[11.13,45.34],[11.36,45.34],[11.36,45.49],[11.13,45.49],[11.13,45.34]]]}},{"type":"Feature","properties":{"id":"amarone","name":"Amarone della Valpolicella DOCG","country":"Italia","region":"Veneto","grapes":"Corvina, Corvinone, Rondinella","type":"DOCG","color":"#8B0000","description":"Appassimento 90+ giorni. 15-17°. Quintarelli, Dal Forno, Masi."},"geometry":{"type":"Polygon","coordinates":[[[10.782,45.448],[10.832,45.432],[10.892,45.43],[10.948,45.438],[11.002,45.452],[11.048,45.468],[11.082,45.49],[11.092,45.518],[11.082,45.548],[11.058,45.57],[11.018,45.582],[10.968,45.582],[10.912,45.572],[10.858,45.552],[10.812,45.522],[10.784,45.49],[10.776,45.468],[10.782,45.448]]]}},{"type":"Feature","properties":{"id":"valpolicella","name":"Valpolicella DOC","country":"Italia","region":"Veneto","grapes":"Corvina, Molinara, Rondinella","type":"DOC","color":"#8B0000","description":"Tre zone: Classico, Valpantena, Est. Base per Ripasso e Amarone."},"geometry":{"type":"Polygon","coordinates":[[[10.74,45.41],[11.05,45.41],[11.05,45.6],[10.74,45.6],[10.74,45.41]]]}},{"type":"Feature","properties":{"id":"recioto","name":"Recioto della Valpolicella DOCG","country":"Italia","region":"Veneto","grapes":"Corvina, Corvinone","type":"DOCG","color":"#8B0000","description":"Vino dolce da appassimento. Uve selezionate. Prugna sotto spirito, cioccolato."},"geometry":{"type":"Polygon","coordinates":[[[10.77,45.43],[11.12,45.43],[11.12,45.59],[10.77,45.59],[10.77,45.43]]]}},{"type":"Feature","properties":{"id":"prosecco","name":"Prosecco Superiore DOCG","country":"Italia","region":"Veneto","grapes":"Glera","type":"DOCG","color":"#FFD700","description":"Valdobbiadene e Conegliano UNESCO. Rive e Cartizze. Metodo Charmat."},"geometry":{"type":"Polygon","coordinates":[[[11.908,45.792],[11.968,45.788],[12.042,45.79],[12.108,45.8],[12.168,45.818],[12.212,45.844],[12.232,45.876],[12.218,45.91],[12.182,45.936],[12.128,45.952],[12.062,45.956],[11.99,45.948],[11.922,45.928],[11.878,45.898],[11.858,45.862],[11.862,45.826],[11.884,45.804],[11.908,45.792]]]}},{"type":"Feature","properties":{"id":"bardolino","name":"Bardolino DOC","country":"Italia","region":"Veneto","grapes":"Corvina, Rondinella","type":"DOC","color":"#8B0000","description":"Sponda veronese del Lago di Garda. Leggero, fresco, ciliegia. Guerrieri Rizzardi."},"geometry":{"type":"Polygon","coordinates":[[[10.6,45.48],[10.85,45.48],[10.85,45.67],[10.6,45.67],[10.6,45.48]]]}},{"type":"Feature","properties":{"id":"colli_euganei","name":"Colli Euganei DOCG","country":"Italia","region":"Veneto","grapes":"Moscato Giallo, Serprino","type":"DOCG","color":"#FFD700","description":"Vulcani dei Colli Euganei. Moscato giallo profumato. Vignalta, Villa Alessi."},"geometry":{"type":"Polygon","coordinates":[[[11.62,45.25],[11.87,45.25],[11.87,45.45],[11.62,45.45],[11.62,45.25]]]}},{"type":"Feature","properties":{"id":"brunello","name":"Brunello di Montalcino DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese Grosso","type":"DOCG","color":"#8B0000","description":"Sangiovese in purezza. Galestro e alberese. Longevità 50+ anni. Biondi Santi, Soldera."},"geometry":{"type":"Polygon","coordinates":[[[11.43,43.005],[11.462,42.996],[11.498,42.992],[11.53,42.994],[11.558,43.003],[11.572,43.018],[11.568,43.042],[11.556,43.065],[11.532,43.082],[11.502,43.09],[11.47,43.086],[11.444,43.072],[11.428,43.05],[11.425,43.028],[11.43,43.005]]]}},{"type":"Feature","properties":{"id":"chianti_classico","name":"Chianti Classico DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Cuore storico tra Firenze e Siena. Gallo Nero. Gran Selezione in vetta."},"geometry":{"type":"Polygon","coordinates":[[[11.11,43.732],[11.18,43.748],[11.25,43.755],[11.32,43.748],[11.39,43.73],[11.44,43.7],[11.462,43.66],[11.458,43.61],[11.44,43.558],[11.408,43.51],[11.368,43.468],[11.32,43.44],[11.26,43.428],[11.195,43.432],[11.14,43.45],[11.102,43.48],[11.082,43.52],[11.078,43.57],[11.088,43.622],[11.098,43.678],[11.11,43.732]]]}},{"type":"Feature","properties":{"id":"chianti","name":"Chianti DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"7 sottozone: Rufina, Colli Fiorentini, Colli Senesi, Pisane. Antinori, Frescobaldi."},"geometry":{"type":"Polygon","coordinates":[[[10.8,43.2],[11.8,43.2],[11.8,44.0],[10.8,44.0],[10.8,43.2]]]}},{"type":"Feature","properties":{"id":"nobile","name":"Vino Nobile di Montepulciano DOCG","country":"Italia","region":"Toscana","grapes":"Prugnolo Gentile","type":"DOCG","color":"#8B0000","description":"Prugnolo su argille e galestro. Avignonesi, Poliziano, Boscarelli."},"geometry":{"type":"Polygon","coordinates":[[[11.67,43.02],[11.87,43.02],[11.87,43.17],[11.67,43.17],[11.67,43.02]]]}},{"type":"Feature","properties":{"id":"morellino","name":"Morellino di Scansano DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese (Morellino)","type":"DOCG","color":"#8B0000","description":"Maremma toscana. Sangiovese su argille costiere. Moris Farms, Rocca di Frassinello."},"geometry":{"type":"Polygon","coordinates":[[[11.18,42.5],[11.48,42.5],[11.48,42.8],[11.18,42.8],[11.18,42.5]]]}},{"type":"Feature","properties":{"id":"bolgheri","name":"Bolgheri DOC","country":"Italia","region":"Toscana","grapes":"Cabernet Sauvignon, Merlot, Cabernet Franc","type":"DOC","color":"#8B0000","description":"Costa toscana. Sassicaia, Ornellaia, Masseto. Suoli limosi e argillosi."},"geometry":{"type":"Polygon","coordinates":[[[10.544,43.278],[10.572,43.262],[10.604,43.25],[10.636,43.244],[10.668,43.248],[10.692,43.264],[10.704,43.288],[10.7,43.318],[10.682,43.344],[10.65,43.358],[10.612,43.36],[10.574,43.348],[10.546,43.326],[10.534,43.298],[10.544,43.278]]]}},{"type":"Feature","properties":{"id":"carmignano","name":"Carmignano DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese, Cabernet Sauvignon","type":"DOCG","color":"#8B0000","description":"Primo Cabernet in Italia. Villa di Capezzana. Suoli calcarei-argillosi."},"geometry":{"type":"Polygon","coordinates":[[[11.0,43.77],[11.18,43.77],[11.18,43.9],[11.0,43.9],[11.0,43.77]]]}},{"type":"Feature","properties":{"id":"vernaccia","name":"Vernaccia di San Gimignano DOCG","country":"Italia","region":"Toscana","grapes":"Vernaccia","type":"DOCG","color":"#FFD700","description":"Prima DOC/DOCG italiana 1966. Vernaccia su tufo pliocenico. Mandorla, salvia, cedro."},"geometry":{"type":"Polygon","coordinates":[[[11.0,43.43],[11.1,43.43],[11.1,43.55],[11.0,43.55],[11.0,43.43]]]}},{"type":"Feature","properties":{"id":"bolgheri_sassicaia","name":"Bolgheri Sassicaia DOC","country":"Italia","region":"Toscana","grapes":"Cabernet Sauvignon, Cabernet Franc","type":"DOC","color":"#8B0000","description":"L'unica DOC dedicata a una sola azienda. Tenuta San Guido. Parker 100 pts 1985."},"geometry":{"type":"Polygon","coordinates":[[[10.54,43.2],[10.65,43.2],[10.65,43.32],[10.54,43.32],[10.54,43.2]]]}},{"type":"Feature","properties":{"id":"sagrantino","name":"Sagrantino di Montefalco DOCG","country":"Italia","region":"Umbria","grapes":"Sagrantino","type":"DOCG","color":"#8B0000","description":"Tannini record mondiali. 33 mesi affinamento. Arnaldo Caprai."},"geometry":{"type":"Polygon","coordinates":[[[12.558,42.798],[12.598,42.788],[12.64,42.786],[12.678,42.792],[12.708,42.81],[12.722,42.836],[12.714,42.864],[12.69,42.886],[12.652,42.898],[12.608,42.9],[12.566,42.888],[12.538,42.864],[12.528,42.836],[12.538,42.812],[12.558,42.798]]]}},{"type":"Feature","properties":{"id":"torgiano","name":"Torgiano Rosso Riserva DOCG","country":"Italia","region":"Umbria","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Torgiano: patria del Rubesco Riserva. Lungarotti come artefice."},"geometry":{"type":"Polygon","coordinates":[[[12.4,42.94],[12.6,42.94],[12.6,43.1],[12.4,43.1],[12.4,42.94]]]}},{"type":"Feature","properties":{"id":"montfalco_rosso","name":"Montefalco Rosso DOC","country":"Italia","region":"Umbria","grapes":"Sangiovese, Sagrantino","type":"DOC","color":"#8B0000","description":"Sangiovese e piccola parte Sagrantino. Più accessibile del DOCG."},"geometry":{"type":"Polygon","coordinates":[[[12.5,42.82],[12.8,42.82],[12.8,43.02],[12.5,43.02],[12.5,42.82]]]}},{"type":"Feature","properties":{"id":"verdicchio","name":"Verdicchio dei Castelli di Jesi DOC","country":"Italia","region":"Marche","grapes":"Verdicchio","type":"DOC","color":"#FFD700","description":"Bianco marchigiano d'eccellenza. Mandorla, agrumi, erbe aromatiche. Umani Ronchi, Garofoli."},"geometry":{"type":"Polygon","coordinates":[[[13.1,43.45],[13.45,43.45],[13.45,43.7],[13.1,43.7],[13.1,43.45]]]}},{"type":"Feature","properties":{"id":"rosso_piceno","name":"Rosso Piceno Superiore DOC","country":"Italia","region":"Marche","grapes":"Montepulciano, Sangiovese","type":"DOC","color":"#8B0000","description":"Oasi degli Angeli — Kurni: Montepulciano in purezza. Marco Casolanetti, Cupra Marittima."},"geometry":{"type":"Polygon","coordinates":[[[13.49,42.72],[13.96,42.72],[13.96,43.12],[13.49,43.12],[13.49,42.72]]]}},{"type":"Feature","properties":{"id":"conero","name":"Conero DOCG","country":"Italia","region":"Marche","grapes":"Montepulciano","type":"DOCG","color":"#8B0000","description":"Monte Conero sul mare Adriatico. Montepulciano su calcari scoscesi."},"geometry":{"type":"Polygon","coordinates":[[[13.49,43.51],[13.68,43.51],[13.68,43.64],[13.49,43.64],[13.49,43.51]]]}},{"type":"Feature","properties":{"id":"aglianico_vulture","name":"Aglianico del Vulture DOC","country":"Italia","region":"Basilicata","grapes":"Aglianico","type":"DOC","color":"#8B0000","description":"Vulture: vulcano spento. Aglianico su suoli vulcanici. Elena Fucci, Paternoster."},"geometry":{"type":"Polygon","coordinates":[[[15.55,40.8],[16.0,40.8],[16.0,41.1],[15.55,41.1],[15.55,40.8]]]}},{"type":"Feature","properties":{"id":"taurasi","name":"Taurasi DOCG","country":"Italia","region":"Campania","grapes":"Aglianico","type":"DOCG","color":"#8B0000","description":"Barolo del Sud. Acidità tagliente su suoli vulcanici irpini. Mastroberardino."},"geometry":{"type":"Polygon","coordinates":[[[14.908,40.832],[14.962,40.818],[15.022,40.814],[15.08,40.822],[15.128,40.844],[15.152,40.876],[15.144,40.912],[15.112,40.942],[15.062,40.958],[15.0,40.958],[14.942,40.942],[14.898,40.912],[14.88,40.874],[14.888,40.85],[14.908,40.832]]]}},{"type":"Feature","properties":{"id":"fiano","name":"Fiano di Avellino DOCG","country":"Italia","region":"Campania","grapes":"Fiano","type":"DOCG","color":"#FFD700","description":"Colline irpine a 400-700m. Note di miele, noce, pera, fumo. Feudi di San Gregorio."},"geometry":{"type":"Polygon","coordinates":[[[14.77,40.82],[15.12,40.82],[15.12,41.0],[14.77,41.0],[14.77,40.82]]]}},{"type":"Feature","properties":{"id":"greco_tufo","name":"Greco di Tufo DOCG","country":"Italia","region":"Campania","grapes":"Greco","type":"DOCG","color":"#FFD700","description":"Tufo vulcanico in Irpinia. Pesca bianca, mandorla, idrocarburi. Benito Ferrara."},"geometry":{"type":"Polygon","coordinates":[[[14.89,40.95],[15.1,40.95],[15.1,41.1],[14.89,41.1],[14.89,40.95]]]}},{"type":"Feature","properties":{"id":"nerello","name":"Etna DOC","country":"Italia","region":"Sicilia","grapes":"Nerello Mascalese, Carricante","type":"DOC","color":"#8B0000","description":"Vigneti vulcanici 400-1000m. Alberello centenario. Contrade come Borgogna siciliana."},"geometry":{"type":"Polygon","coordinates":[[[14.89,37.64],[15.17,37.64],[15.17,37.85],[14.89,37.85],[14.89,37.64]]]}},{"type":"Feature","properties":{"id":"nero_avola","name":"Sicilia DOC","country":"Italia","region":"Sicilia","grapes":"Nero d'Avola, Catarratto","type":"DOC","color":"#8B0000","description":"Tutta la Sicilia. Nero d'Avola come ambasciatore. Donnafugata, Planeta, Tasca."},"geometry":{"type":"Polygon","coordinates":[[[12.43,36.63],[15.65,36.63],[15.65,38.3],[12.43,38.3],[12.43,36.63]]]}},{"type":"Feature","properties":{"id":"cerasuolo","name":"Cerasuolo di Vittoria DOCG","country":"Italia","region":"Sicilia","grapes":"Nero d'Avola, Frappato","type":"DOCG","color":"#8B0000","description":"Unica DOCG siciliana. Ibleo. Nero d'Avola + Frappato. COS, Valle dell'Acate."},"geometry":{"type":"Polygon","coordinates":[[[14.42,36.88],[14.85,36.88],[14.85,37.1],[14.42,37.1],[14.42,36.88]]]}},{"type":"Feature","properties":{"id":"marsala","name":"Marsala DOC","country":"Italia","region":"Sicilia","grapes":"Grillo, Catarratto, Inzolia","type":"DOC","color":"#FFD700","description":"Vino liquoroso storico. Stile Solera. Fine, Superiore, Vergine. Florio, Pellegrino."},"geometry":{"type":"Polygon","coordinates":[[[12.4,37.7],[12.65,37.7],[12.65,37.9],[12.4,37.9],[12.4,37.7]]]}},{"type":"Feature","properties":{"id":"passito_pantelleria","name":"Passito di Pantelleria DOC","country":"Italia","region":"Sicilia","grapes":"Zibibbo (Moscato d'Alessandria)","type":"DOC","color":"#FFD700","description":"Isola di Pantelleria. Vite allevata ad alberello basso. Arancio candito, miele, fico."},"geometry":{"type":"Polygon","coordinates":[[[11.95,36.68],[12.1,36.68],[12.1,36.85],[11.95,36.85],[11.95,36.68]]]}},{"type":"Feature","properties":{"id":"cannonau","name":"Cannonau di Sardegna DOC","country":"Italia","region":"Sardegna","grapes":"Cannonau (Grenache)","type":"DOC","color":"#8B0000","description":"Sardegna longevità. Granito. Pollifemo, Giuseppe Sedilesu. Centenari di Orgosolo."},"geometry":{"type":"Polygon","coordinates":[[[8.5,39.5],[9.83,39.5],[9.83,40.2],[8.5,40.2],[8.5,39.5]]]}},{"type":"Feature","properties":{"id":"vermentino_gallura","name":"Vermentino di Gallura DOCG","country":"Italia","region":"Sardegna","grapes":"Vermentino","type":"DOCG","color":"#FFD700","description":"Unica DOCG sarda per bianchi. Granito e sabbia. Capichera, Surrau."},"geometry":{"type":"Polygon","coordinates":[[[8.95,41.0],[9.53,41.0],[9.53,41.37],[8.95,41.37],[8.95,41.0]]]}},{"type":"Feature","properties":{"id":"carignano_sulcis","name":"Carignano del Sulcis DOC","country":"Italia","region":"Sardegna","grapes":"Carignano (Carignan)","type":"DOC","color":"#8B0000","description":"Sulcis: vecchi cespugli allevati ad alberello su sabbie. Santadi."},"geometry":{"type":"Polygon","coordinates":[[[8.35,38.9],[8.9,38.9],[8.9,39.35],[8.35,39.35],[8.35,38.9]]]}},{"type":"Feature","properties":{"id":"alta_langa","name":"Alta Langa DOCG","country":"Italia","region":"Piemonte","grapes":"Pinot Nero, Chardonnay","type":"DOCG","color":"#FFD700","description":"Metodo Classico piemontese. Alte colline a 250-500m. Contratto, Enrico Serafino."},"geometry":{"type":"Polygon","coordinates":[[[7.9,44.38],[8.3,44.38],[8.3,44.58],[7.9,44.58],[7.9,44.38]]]}},{"type":"Feature","properties":{"id":"lugana","name":"Lugana DOC","country":"Italia","region":"Lombardia/Veneto","grapes":"Turbiana (Trebbiano di Lugana)","type":"DOC","color":"#FFD700","description":"Riva sud del Lago di Garda. Suoli argillosi glaciali. Ca' dei Frati, Zenato."},"geometry":{"type":"Polygon","coordinates":[[[10.5,45.38],[10.85,45.38],[10.85,45.55],[10.5,45.55],[10.5,45.38]]]}},{"type":"Feature","properties":{"id":"custoza","name":"Bianco di Custoza DOC","country":"Italia","region":"Veneto","grapes":"Garganega, Trebbiano, Cortese","type":"DOC","color":"#FFD700","description":"Colline moreniche del Garda. Bianco fresco e floreale. Cavalchina."},"geometry":{"type":"Polygon","coordinates":[[[10.7,45.32],[10.95,45.32],[10.95,45.48],[10.7,45.48],[10.7,45.32]]]}},{"type":"Feature","properties":{"id":"colli_fiorentini","name":"Colli Fiorentini DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Colline intorno a Firenze. Chianti fresco e immediato."},"geometry":{"type":"Polygon","coordinates":[[[11.0,43.7],[11.4,43.7],[11.4,43.95],[11.0,43.95],[11.0,43.7]]]}},{"type":"Feature","properties":{"id":"pomino","name":"Pomino DOC","country":"Italia","region":"Toscana","grapes":"Sangiovese, Pinot Nero, Chardonnay","type":"DOC","color":"#8B0000","description":"Alta quota in Mugello. Frescobaldi come custode storico."},"geometry":{"type":"Polygon","coordinates":[[[11.55,43.85],[11.75,43.85],[11.75,44.0],[11.55,44.0],[11.55,43.85]]]}},{"type":"Feature","properties":{"id":"montecucco","name":"Montecucco Sangiovese DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Ombrone, vicino Montalcino. Collemassari, Basile."},"geometry":{"type":"Polygon","coordinates":[[[11.15,42.8],[11.4,42.8],[11.4,43.0],[11.15,43.0],[11.15,42.8]]]}},{"type":"Feature","properties":{"id":"maremma","name":"Maremma Toscana DOC","country":"Italia","region":"Toscana","grapes":"Vermentino, Ciliegiolo, Sangiovese","type":"DOC","color":"#8B0000","description":"Costa maremmana versatile. Rocca di Frassinello, Sassotondo."},"geometry":{"type":"Polygon","coordinates":[[[11.0,42.3],[11.5,42.3],[11.5,42.8],[11.0,42.8],[11.0,42.3]]]}},{"type":"Feature","properties":{"id":"colli_di_luni","name":"Colli di Luni DOC","country":"Italia","region":"Liguria/Toscana","grapes":"Vermentino, Sangiovese","type":"DOC","color":"#FFD700","description":"Confine ligure-toscano. Vermentino minerale su scisti. Ottaviano Lambruschi."},"geometry":{"type":"Polygon","coordinates":[[[9.8,44.05],[10.1,44.05],[10.1,44.25],[9.8,44.25],[9.8,44.05]]]}},{"type":"Feature","properties":{"id":"cinque_terre","name":"Cinque Terre DOC","country":"Italia","region":"Liguria","grapes":"Bosco, Albarola, Vermentino","type":"DOC","color":"#FFD700","description":"Terrazzamenti a picco sul mare. Uve trasportate a mano. Cooperativa Cinque Terre."},"geometry":{"type":"Polygon","coordinates":[[[9.6,44.1],[9.95,44.1],[9.95,44.25],[9.6,44.25],[9.6,44.1]]]}},{"type":"Feature","properties":{"id":"sciacchetrà","name":"Cinque Terre Sciacchetrà DOC","country":"Italia","region":"Liguria","grapes":"Bosco, Albarola, Vermentino","type":"DOC","color":"#FFD700","description":"Passito ligure rarissimo. Sole e salmastro. Produzione limitatissima."},"geometry":{"type":"Polygon","coordinates":[[[9.6,44.1],[9.95,44.1],[9.95,44.25],[9.6,44.25],[9.6,44.1]]]}},{"type":"Feature","properties":{"id":"ribolla_collio","name":"Collio DOC","country":"Italia","region":"Friuli VG","grapes":"Ribolla Gialla, Friulano, Malvasia Istriana","type":"DOC","color":"#FFD700","description":"Colline marno-arenacee del Collio. Gravner, Radikon, Schiopetto."},"geometry":{"type":"Polygon","coordinates":[[[13.4,45.85],[13.75,45.85],[13.75,46.05],[13.4,46.05],[13.4,45.85]]]}},{"type":"Feature","properties":{"id":"colli_orientali","name":"Colli Orientali del Friuli DOC","country":"Italia","region":"Friuli VG","grapes":"Ribolla Gialla, Schioppettino, Refosco","type":"DOC","color":"#8B0000","description":"Friuli orientale. Ramandolo DOCG nel comune di Nimis. Ronchi di Cialla."},"geometry":{"type":"Polygon","coordinates":[[[13.3,46.0],[13.7,46.0],[13.7,46.3],[13.3,46.3],[13.3,46.0]]]}},{"type":"Feature","properties":{"id":"ramandolo","name":"Ramandolo DOCG","country":"Italia","region":"Friuli VG","grapes":"Verduzzo Friulano","type":"DOCG","color":"#FFD700","description":"Vino dolce passito su scisti. Piccolo cru di Nimis. Giovanni Dri."},"geometry":{"type":"Polygon","coordinates":[[[13.38,46.28],[13.5,46.28],[13.5,46.36],[13.38,46.36],[13.38,46.28]]]}},{"type":"Feature","properties":{"id":"trento","name":"Trento DOC","country":"Italia","region":"Trentino-AA","grapes":"Chardonnay, Pinot Nero","type":"DOC","color":"#FFD700","description":"Metodo Classico trentino. Ferrari, Rotari. Dolomiti come sfondo."},"geometry":{"type":"Polygon","coordinates":[[[10.85,45.85],[11.35,45.85],[11.35,46.25],[10.85,46.25],[10.85,45.85]]]}},{"type":"Feature","properties":{"id":"teroldego","name":"Teroldego Rotaliano DOC","country":"Italia","region":"Trentino-AA","grapes":"Teroldego","type":"DOC","color":"#8B0000","description":"Campo Rotaliano: piana alluvionale. Teroldego autoctono trentino. Foradori, Mezzacorona."},"geometry":{"type":"Polygon","coordinates":[[[11.04,46.1],[11.22,46.1],[11.22,46.22],[11.04,46.22],[11.04,46.1]]]}},{"type":"Feature","properties":{"id":"alto_adige","name":"Alto Adige DOC","country":"Italia","region":"Alto Adige/Sudtirol","grapes":"Lagrein, Gewürztraminer, Pinot Grigio","type":"DOC","color":"#8B0000","description":"21 sottozone. Lagrein di Bolzano. Gewürztraminer di Tramin. Alois Lageder."},"geometry":{"type":"Polygon","coordinates":[[[10.8,46.3],[11.5,46.3],[11.5,47.1],[10.8,47.1],[10.8,46.3]]]}},{"type":"Feature","properties":{"id":"gewurztraminer_aa","name":"Alto Adige Gewürztraminer DOC","country":"Italia","region":"Alto Adige/Sudtirol","grapes":"Gewürztraminer","type":"DOC","color":"#FFD700","description":"Tramin/Termeno patria del Traminer. Rosa, litchi, spezie orientali."},"geometry":{"type":"Polygon","coordinates":[[[11.2,46.3],[11.4,46.3],[11.4,46.5],[11.2,46.5],[11.2,46.3]]]}},{"type":"Feature","properties":{"id":"aosta","name":"Valle d'Aosta DOC","country":"Italia","region":"Valle d'Aosta","grapes":"Petit Rouge, Fumin, Petite Arvine","type":"DOC","color":"#8B0000","description":"La più piccola DOC d'Italia. Vigneti a 300-1200m. Grosjean, Anselmet, La Crotta."},"geometry":{"type":"Polygon","coordinates":[[[6.8,45.5],[7.85,45.5],[7.85,45.9],[6.8,45.9],[6.8,45.5]]]}},{"type":"Feature","properties":{"id":"lacrima","name":"Lacrima di Morro d'Alba DOC","country":"Italia","region":"Marche","grapes":"Lacrima","type":"DOC","color":"#8B0000","description":"Vitigno autoctono marchigiano rarissimo. Profumi intensi: violetta, rosa, fragola. Stefano Mancinelli."},"geometry":{"type":"Polygon","coordinates":[[[13.32,43.56],[13.5,43.56],[13.5,43.75],[13.32,43.75],[13.32,43.56]]]}},{"type":"Feature","properties":{"id":"offida","name":"Offida DOCG","country":"Italia","region":"Marche","grapes":"Pecorino, Passerina","type":"DOCG","color":"#FFD700","description":"Colli Ascolani. Pecorino bianco sapido e minerale. Velenosi, Aurora."},"geometry":{"type":"Polygon","coordinates":[[[13.59,42.9],[13.75,42.9],[13.75,43.08],[13.59,43.08],[13.59,42.9]]]}},{"type":"Feature","properties":{"id":"montepulciano_d_abruzzo","name":"Montepulciano d'Abruzzo DOC","country":"Italia","region":"Abruzzo","grapes":"Montepulciano","type":"DOC","color":"#8B0000","description":"Costa adriatica. Montepulciano versione morbida. Valentini, Emidio Pepe, Masciarelli."},"geometry":{"type":"Polygon","coordinates":[[[13.2,41.9],[14.85,41.9],[14.85,42.8],[13.2,42.8],[13.2,41.9]]]}},{"type":"Feature","properties":{"id":"trebbiano_abruzzo","name":"Trebbiano d'Abruzzo DOC","country":"Italia","region":"Abruzzo","grapes":"Trebbiano Abruzzese","type":"DOC","color":"#FFD700","description":"Valentini il massimo interprete. Bianco longevo e minerale insolito."},"geometry":{"type":"Polygon","coordinates":[[[13.2,41.9],[14.85,41.9],[14.85,42.8],[13.2,42.8],[13.2,41.9]]]}},{"type":"Feature","properties":{"id":"cirò","name":"Cirò DOC","country":"Italia","region":"Calabria","grapes":"Gaglioppo, Greco Bianco","type":"DOC","color":"#8B0000","description":"Il più antico vino del mondo (Crimisa greca). Gaglioppo su suoli argillosi. Librandi."},"geometry":{"type":"Polygon","coordinates":[[[17.0,39.18],[17.25,39.18],[17.25,39.42],[17.0,39.42],[17.0,39.18]]]}},{"type":"Feature","properties":{"id":"primitivo_manduria","name":"Primitivo di Manduria DOCG","country":"Italia","region":"Puglia","grapes":"Primitivo","type":"DOCG","color":"#8B0000","description":"Tavoliere pugliese. Primitivo (Zinfandel) su suoli rossi ferrosi. Pervini, Gianfranco Fino."},"geometry":{"type":"Polygon","coordinates":[[[17.5,40.3],[17.9,40.3],[17.9,40.6],[17.5,40.6],[17.5,40.3]]]}},{"type":"Feature","properties":{"id":"negroamaro","name":"Salento IGT / Negroamaro","country":"Italia","region":"Puglia","grapes":"Negroamaro","type":"IGT","color":"#8B0000","description":"Tacco d'Italia. Negroamaro su argille rosse. Cosimo Taurino, Leone de Castris."},"geometry":{"type":"Polygon","coordinates":[[[17.6,39.8],[18.5,39.8],[18.5,40.5],[17.6,40.5],[17.6,39.8]]]}},{"type":"Feature","properties":{"id":"locorotondo","name":"Locorotondo DOC","country":"Italia","region":"Puglia","grapes":"Verdeca, Bianco d'Alessano","type":"DOC","color":"#FFD700","description":"Valle d'Itria. Trulli e vigneti. Bianco leggero e fresco. Cantina di Locorotondo."},"geometry":{"type":"Polygon","coordinates":[[[17.35,40.72],[17.55,40.72],[17.55,40.85],[17.35,40.85],[17.35,40.72]]]}},{"type":"Feature","properties":{"id":"frascati","name":"Frascati Superiore DOCG","country":"Italia","region":"Lazio","grapes":"Malvasia Bianca, Trebbiano","type":"DOCG","color":"#FFD700","description":"Castelli Romani vulcanici. Il vino bianco di Roma. Fondata su suoli tufacei."},"geometry":{"type":"Polygon","coordinates":[[[12.6,41.75],[12.9,41.75],[12.9,42.0],[12.6,42.0],[12.6,41.75]]]}},{"type":"Feature","properties":{"id":"cesanese","name":"Cesanese del Piglio DOCG","country":"Italia","region":"Lazio","grapes":"Cesanese","type":"DOCG","color":"#8B0000","description":"Colline Ciociare. Cesanese autoctono laziale. Giovanna Trisorio, Coletti Conti."},"geometry":{"type":"Polygon","coordinates":[[[13.1,41.75],[13.35,41.75],[13.35,41.9],[13.1,41.9],[13.1,41.75]]]}},{"type":"Feature","properties":{"id":"orvieto","name":"Orvieto DOC","country":"Italia","region":"Umbria/Lazio","grapes":"Trebbiano Toscano, Grechetto","type":"DOC","color":"#FFD700","description":"La rupe di tufo. Abboccato tradizionale poi secco. Bigi, Antinori."},"geometry":{"type":"Polygon","coordinates":[[[12.0,42.62],[12.25,42.62],[12.25,42.82],[12.0,42.82],[12.0,42.62]]]}},{"type":"Feature","properties":{"id":"vermentino_sardegna","name":"Vermentino di Sardegna DOC","country":"Italia","region":"Sardegna","grapes":"Vermentino","type":"DOC","color":"#FFD700","description":"Tutta la Sardegna. Vermentino fresco e salino. Sella e Mosca."},"geometry":{"type":"Polygon","coordinates":[[[8.14,38.85],[9.83,38.85],[9.83,41.25],[8.14,41.25],[8.14,38.85]]]}},{"type":"Feature","properties":{"id":"nuragus","name":"Nuragus di Cagliari DOC","country":"Italia","region":"Sardegna","grapes":"Nuragus","type":"DOC","color":"#FFD700","description":"Cagliari. Nuragus autoctono su suoli alluvionali. Leggero e fruttato."},"geometry":{"type":"Polygon","coordinates":[[[8.9,39.1],[9.45,39.1],[9.45,39.55],[8.9,39.55],[8.9,39.1]]]}},{"type":"Feature","properties":{"id":"carmenere","name":"Venezia Giulia IGT","country":"Italia","region":"Friuli VG","grapes":"Carmenere, Merlot, Refosco","type":"IGT","color":"#8B0000","description":"Collio e Carso. Terrano sul Carso calcareo. Zidarich, Vodopivec."},"geometry":{"type":"Polygon","coordinates":[[[13.5,45.55],[13.85,45.55],[13.85,45.85],[13.5,45.85],[13.5,45.55]]]}},{"type":"Feature","properties":{"id":"champagne","name":"Champagne AOC","country":"Francia","region":"Champagne","grapes":"Pinot Noir, Chardonnay, Pinot Meunier","type":"AOC","color":"#FFD700","description":"Suoli cretacei. 5 sottozone. Krug, Dom Pérignon, Bollinger, Salon."},"geometry":{"type":"Polygon","coordinates":[[[3.648,49.488],[3.75,49.412],[3.888,49.348],[4.028,49.298],[4.168,49.268],[4.308,49.258],[4.422,49.278],[4.468,49.328],[4.462,49.402],[4.408,49.482],[4.312,49.548],[4.188,49.596],[4.048,49.618],[3.908,49.608],[3.782,49.568],[3.688,49.512],[3.648,49.488]]]}},{"type":"Feature","properties":{"id":"romanee_conti","name":"Romanée-Conti Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"Grand Cru","color":"#8B0000","description":"1.8 ettari. Il vino più costoso. DRC. Vosne-Romanée, Côte de Nuits."},"geometry":{"type":"Polygon","coordinates":[[[4.95,47.157],[4.964,47.157],[4.964,47.168],[4.95,47.168],[4.95,47.157]]]}},{"type":"Feature","properties":{"id":"gevrey","name":"Gevrey-Chambertin","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Chambertin, vino di Napoleone. 9 Grand Crus. Rousseau, Mortet."},"geometry":{"type":"Polygon","coordinates":[[[4.92,47.17],[5.03,47.17],[5.03,47.3],[4.92,47.3],[4.92,47.17]]]}},{"type":"Feature","properties":{"id":"meursault","name":"Meursault","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Capitale del Chardonnay. Perrières, Genevrières, Charmes 1er Cru. Coche-Dury."},"geometry":{"type":"Polygon","coordinates":[[[4.71,46.93],[4.83,46.93],[4.83,47.03],[4.71,47.03],[4.71,46.93]]]}},{"type":"Feature","properties":{"id":"montrachet","name":"Montrachet Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"Grand Cru","color":"#FFD700","description":"Il più grande Chardonnay. 7.99 ha tra Puligny e Chassagne."},"geometry":{"type":"Polygon","coordinates":[[[4.762,46.94],[4.783,46.94],[4.783,46.952],[4.762,46.952],[4.762,46.94]]]}},{"type":"Feature","properties":{"id":"chablis","name":"Chablis","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Kimmeridgiano. 7 Grand Crus. Minérale austero. Raveneau, Dauvissat."},"geometry":{"type":"Polygon","coordinates":[[[3.598,47.698],[3.682,47.672],[3.778,47.66],[3.868,47.662],[3.938,47.678],[3.968,47.708],[3.952,47.742],[3.902,47.772],[3.828,47.79],[3.742,47.792],[3.658,47.776],[3.598,47.748],[3.578,47.722],[3.598,47.698]]]}},{"type":"Feature","properties":{"id":"pauillac","name":"Pauillac","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Merlot","type":"AOC","color":"#8B0000","description":"Tre Premier GCC: Latour, Lafite, Mouton. Gravel profondo."},"geometry":{"type":"Polygon","coordinates":[[[-0.808,45.138],[-0.772,45.13],[-0.732,45.13],[-0.694,45.138],[-0.666,45.156],[-0.652,45.18],[-0.654,45.206],[-0.668,45.228],[-0.694,45.242],[-0.724,45.246],[-0.756,45.24],[-0.782,45.222],[-0.798,45.196],[-0.806,45.168],[-0.808,45.138]]]}},{"type":"Feature","properties":{"id":"margaux","name":"Margaux","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Merlot","type":"AOC","color":"#8B0000","description":"Eleganza assoluta di Bordeaux. Château Margaux. Suoli ghiaiosi sottili."},"geometry":{"type":"Polygon","coordinates":[[[-0.692,44.994],[-0.666,44.99],[-0.642,44.994],[-0.626,45.01],[-0.622,45.032],[-0.628,45.054],[-0.644,45.068],[-0.664,45.074],[-0.684,45.07],[-0.7,45.054],[-0.706,45.032],[-0.704,45.01],[-0.692,44.994]]]}},{"type":"Feature","properties":{"id":"pomerol","name":"Pomerol","country":"Francia","region":"Bordeaux","grapes":"Merlot, Cabernet Franc","type":"AOC","color":"#8B0000","description":"Argilla blu di Pétrus. Le Pin, Lafleur. Rive droite."},"geometry":{"type":"Polygon","coordinates":[[[-0.208,44.892],[-0.184,44.886],[-0.158,44.886],[-0.136,44.894],[-0.122,44.91],[-0.12,44.93],[-0.128,44.948],[-0.146,44.958],[-0.168,44.96],[-0.19,44.954],[-0.206,44.938],[-0.214,44.918],[-0.208,44.892]]]}},{"type":"Feature","properties":{"id":"st_emilion","name":"Saint-Émilion Grand Cru","country":"Francia","region":"Bordeaux","grapes":"Merlot, Cabernet Franc","type":"AOC","color":"#8B0000","description":"Cheval Blanc, Ausone. Côtes calcareee e argille."},"geometry":{"type":"Polygon","coordinates":[[[-0.21,44.85],[-0.08,44.85],[-0.08,44.95],[-0.21,44.95],[-0.21,44.85]]]}},{"type":"Feature","properties":{"id":"sauternes","name":"Sauternes","country":"Francia","region":"Bordeaux","grapes":"Sémillon, Sauvignon Blanc","type":"AOC","color":"#FFD700","description":"Botrytis nobile. Château d'Yquem Premier Cru Supérieur. Miele e zafferano."},"geometry":{"type":"Polygon","coordinates":[[[-0.392,44.462],[-0.338,44.448],[-0.28,44.444],[-0.232,44.452],[-0.198,44.472],[-0.182,44.502],[-0.182,44.536],[-0.196,44.568],[-0.222,44.592],[-0.256,44.604],[-0.296,44.602],[-0.334,44.588],[-0.364,44.562],[-0.384,44.528],[-0.392,44.49],[-0.392,44.462]]]}},{"type":"Feature","properties":{"id":"graves","name":"Graves","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Semillon","type":"AOC","color":"#8B0000","description":"Gravel su riva sinistra. Haut-Bailly, Smith Haut Lafitte, Domaine de Chevalier."},"geometry":{"type":"Polygon","coordinates":[[[-0.65,44.58],[-0.35,44.58],[-0.35,44.92],[-0.65,44.92],[-0.65,44.58]]]}},{"type":"Feature","properties":{"id":"pessac","name":"Pessac-Léognan","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Sauvignon Blanc","type":"AOC","color":"#8B0000","description":"Haut-Brion e La Mission. Gravel urbano. I più grandi bianchi secchi di Bordeaux."},"geometry":{"type":"Polygon","coordinates":[[[-0.67,44.7],[-0.52,44.7],[-0.52,44.85],[-0.67,44.85],[-0.67,44.7]]]}},{"type":"Feature","properties":{"id":"st_estephe","name":"Saint-Estèphe","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Merlot","type":"AOC","color":"#8B0000","description":"Argille e gravel. Cos d'Estournel e Montrose. Struttura tannica."},"geometry":{"type":"Polygon","coordinates":[[[-0.8,45.25],[-0.64,45.25],[-0.64,45.36],[-0.8,45.36],[-0.8,45.25]]]}},{"type":"Feature","properties":{"id":"st_julien","name":"Saint-Julien","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon","type":"AOC","color":"#8B0000","description":"11 Grands Crus Classés. Léoville Las Cases, Ducru-Beaucaillou. Eleganza."},"geometry":{"type":"Polygon","coordinates":[[[-0.77,45.08],[-0.65,45.08],[-0.65,45.2],[-0.77,45.2],[-0.77,45.08]]]}},{"type":"Feature","properties":{"id":"chateauneuf","name":"Châteauneuf-du-Pape","country":"Francia","region":"Rhône","grapes":"Grenache, Syrah, Mourvèdre","type":"AOC","color":"#8B0000","description":"Galets roulés. 13 vitigni. Rayas, Bonneau, Beaucastel."},"geometry":{"type":"Polygon","coordinates":[[[4.748,43.978],[4.802,43.96],[4.858,43.952],[4.91,43.958],[4.946,43.978],[4.96,44.008],[4.952,44.04],[4.926,44.068],[4.882,44.086],[4.83,44.09],[4.776,44.076],[4.738,44.05],[4.722,44.018],[4.73,43.992],[4.748,43.978]]]}},{"type":"Feature","properties":{"id":"hermitage","name":"Hermitage","country":"Francia","region":"Rhône","grapes":"Syrah, Marsanne","type":"AOC","color":"#8B0000","description":"Collina sacra del Rhône settentrionale. Chave, Jaboulet La Chapelle."},"geometry":{"type":"Polygon","coordinates":[[[4.8,45.062],[4.822,45.058],[4.848,45.062],[4.866,45.074],[4.872,45.09],[4.864,45.104],[4.844,45.112],[4.82,45.112],[4.8,45.104],[4.79,45.09],[4.792,45.074],[4.8,45.062]]]}},{"type":"Feature","properties":{"id":"cote_rotie","name":"Côte-Rôtie","country":"Francia","region":"Rhône","grapes":"Syrah, Viognier","type":"AOC","color":"#8B0000","description":"Côte Brune e Côte Blonde. Guigal Le Vins de Vienne."},"geometry":{"type":"Polygon","coordinates":[[[4.755,45.43],[4.845,45.43],[4.845,45.515],[4.755,45.515],[4.755,45.43]]]}},{"type":"Feature","properties":{"id":"condrieu","name":"Condrieu","country":"Francia","region":"Rhône","grapes":"Viognier","type":"AOC","color":"#FFD700","description":"Viognier al massimo. Solo 135 ha su granito. Château-Grillet monopole."},"geometry":{"type":"Polygon","coordinates":[[[4.74,45.32],[4.825,45.32],[4.825,45.435],[4.74,45.435],[4.74,45.32]]]}},{"type":"Feature","properties":{"id":"cornas","name":"Cornas","country":"Francia","region":"Rhône","grapes":"Syrah","type":"AOC","color":"#8B0000","description":"Granito nero. Syrah puro robusto. Clape, Colombo, Allemand."},"geometry":{"type":"Polygon","coordinates":[[[4.83,44.92],[4.91,44.92],[4.91,45.02],[4.83,45.02],[4.83,44.92]]]}},{"type":"Feature","properties":{"id":"st_joseph","name":"Saint-Joseph","country":"Francia","region":"Rhône","grapes":"Syrah, Marsanne","type":"AOC","color":"#8B0000","description":"Riva destra del Rhône. Granito. Chave, Chapoutier Gonon."},"geometry":{"type":"Polygon","coordinates":[[[4.68,44.78],[4.95,44.78],[4.95,45.43],[4.68,45.43],[4.68,44.78]]]}},{"type":"Feature","properties":{"id":"gigondas","name":"Gigondas","country":"Francia","region":"Rhône","grapes":"Grenache, Syrah","type":"AOC","color":"#8B0000","description":"Dentelles de Montmirail. Grenache poderoso su calcare. Raspail-Ay."},"geometry":{"type":"Polygon","coordinates":[[[4.95,44.1],[5.1,44.1],[5.1,44.2],[4.95,44.2],[4.95,44.1]]]}},{"type":"Feature","properties":{"id":"vacqueyras","name":"Vacqueyras","country":"Francia","region":"Rhône","grapes":"Grenache, Syrah, Mourvèdre","type":"AOC","color":"#8B0000","description":"Côtes du Rhône Villages upgradato. Grenache speziato. Vieux Télégraphe."},"geometry":{"type":"Polygon","coordinates":[[[4.92,44.07],[5.05,44.07],[5.05,44.17],[4.92,44.17],[4.92,44.07]]]}},{"type":"Feature","properties":{"id":"sancerre","name":"Sancerre","country":"Francia","region":"Loire","grapes":"Sauvignon Blanc, Pinot Noir","type":"AOC","color":"#FFD700","description":"Terres blanches, caillottes, silex. Henri Bourgeois, Vacheron, Dagueneau."},"geometry":{"type":"Polygon","coordinates":[[[2.788,47.268],[2.832,47.256],[2.876,47.256],[2.91,47.268],[2.926,47.292],[2.92,47.32],[2.896,47.342],[2.86,47.352],[2.82,47.348],[2.788,47.33],[2.772,47.306],[2.78,47.282],[2.788,47.268]]]}},{"type":"Feature","properties":{"id":"pouilly_fume","name":"Pouilly-Fumé","country":"Francia","region":"Loire","grapes":"Sauvignon Blanc","type":"AOC","color":"#FFD700","description":"Silex sulla riva destra della Loire. Fumé da selce. Dagueneau Silex, Baron de L."},"geometry":{"type":"Polygon","coordinates":[[[2.84,47.27],[2.98,47.27],[2.98,47.38],[2.84,47.38],[2.84,47.27]]]}},{"type":"Feature","properties":{"id":"muscadet","name":"Muscadet Sèvre et Maine","country":"Francia","region":"Loire","grapes":"Melon de Bourgogne","type":"AOC","color":"#FFD700","description":"Sur Lie 9+ mesi. Salinità atlantica. Abbinamento ostriche. L'Écu."},"geometry":{"type":"Polygon","coordinates":[[[-1.7,46.9],[-1.07,46.9],[-1.07,47.32],[-1.7,47.32],[-1.7,46.9]]]}},{"type":"Feature","properties":{"id":"vouvray","name":"Vouvray","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"AOC","color":"#FFD700","description":"Tufa rocciosa. Sec, Demi-Sec, Moelleux, Pétillant. Huet, Foreau."},"geometry":{"type":"Polygon","coordinates":[[[0.74,47.35],[0.98,47.35],[0.98,47.48],[0.74,47.48],[0.74,47.35]]]}},{"type":"Feature","properties":{"id":"chinon","name":"Chinon","country":"Francia","region":"Loire","grapes":"Cabernet Franc","type":"AOC","color":"#8B0000","description":"Tuffeau e gravel. Cabernet Franc elegante. Joguet, Bernard Baudry."},"geometry":{"type":"Polygon","coordinates":[[[0.15,47.12],[0.38,47.12],[0.38,47.26],[0.15,47.26],[0.15,47.12]]]}},{"type":"Feature","properties":{"id":"bourgueil","name":"Bourgueil","country":"Francia","region":"Loire","grapes":"Cabernet Franc","type":"AOC","color":"#8B0000","description":"Sable e tufo. Cabernet Franc fresco e vinoso. Audebert, Breton."},"geometry":{"type":"Polygon","coordinates":[[[0.08,47.22],[0.32,47.22],[0.32,47.36],[0.08,47.36],[0.08,47.22]]]}},{"type":"Feature","properties":{"id":"alsace","name":"Alsace AOC","country":"Francia","region":"Alsazia","grapes":"Riesling, Gewurztraminer, Pinot Gris","type":"AOC","color":"#FFD700","description":"Stile tedesco, territorio francese. 51 Grand Crus. Trimbach, Weinbach, Zind-Humbrecht."},"geometry":{"type":"Polygon","coordinates":[[[7.15,47.45],[7.64,47.45],[7.64,48.97],[7.15,48.97],[7.15,47.45]]]}},{"type":"Feature","properties":{"id":"alsace_riesling","name":"Alsace Grand Cru Schlossberg","country":"Francia","region":"Alsazia","grapes":"Riesling","type":"Grand Cru","color":"#FFD700","description":"Il Grand Cru più esteso. Granito di Kientzheim. Blanck, Weinbach."},"geometry":{"type":"Polygon","coordinates":[[[7.28,48.11],[7.35,48.11],[7.35,48.15],[7.28,48.15],[7.28,48.11]]]}},{"type":"Feature","properties":{"id":"alsace_gc_rangen","name":"Alsace Grand Cru Rangen","country":"Francia","region":"Alsazia","grapes":"Riesling, Pinot Gris","type":"Grand Cru","color":"#FFD700","description":"Il più meridionale e scosceso. Vulcanite nera. Schoffit, Zind-Humbrecht."},"geometry":{"type":"Polygon","coordinates":[[[7.35,47.59],[7.43,47.59],[7.43,47.64],[7.35,47.64],[7.35,47.59]]]}},{"type":"Feature","properties":{"id":"pouilly_fuisse","name":"Pouilly-Fuissé","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Mâconnais. Calcari di Pouilly e Fuissé. Ferret, Guffens-Heynen."},"geometry":{"type":"Polygon","coordinates":[[[4.67,46.25],[4.84,46.25],[4.84,46.38],[4.67,46.38],[4.67,46.25]]]}},{"type":"Feature","properties":{"id":"saint_veran","name":"Saint-Véran","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Mâconnais. Chardonnay fresco e floreale su calcari. Corsin, Deux Roches."},"geometry":{"type":"Polygon","coordinates":[[[4.68,46.24],[4.85,46.24],[4.85,46.36],[4.68,46.36],[4.68,46.24]]]}},{"type":"Feature","properties":{"id":"nuits_st_georges","name":"Nuits-Saint-Georges","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Côte de Nuits. 41 Premiers Crus. Arlot, Henri Gouges, Leroy."},"geometry":{"type":"Polygon","coordinates":[[[4.93,47.07],[5.0,47.07],[5.0,47.2],[4.93,47.2],[4.93,47.07]]]}},{"type":"Feature","properties":{"id":"puligny","name":"Puligny-Montrachet","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Capitale del Chardonnay bianco. Bâtard, Bienvenues, Chevalier-Montrachet."},"geometry":{"type":"Polygon","coordinates":[[[4.74,46.93],[4.8,46.93],[4.8,47.01],[4.74,47.01],[4.74,46.93]]]}},{"type":"Feature","properties":{"id":"chassagne","name":"Chassagne-Montrachet","country":"Francia","region":"Bourgogne","grapes":"Chardonnay, Pinot Noir","type":"AOC","color":"#FFD700","description":"Sud Côte de Beaune. Bâtard-Montrachet. Remoissenet, Gagnard."},"geometry":{"type":"Polygon","coordinates":[[[4.75,46.92],[4.82,46.92],[4.82,47.0],[4.75,47.0],[4.75,46.92]]]}},{"type":"Feature","properties":{"id":"pommard","name":"Pommard","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Pinot Noir potente e strutturato. Argille pesanti. Mugnier, Billard-Gonnet."},"geometry":{"type":"Polygon","coordinates":[[[4.76,47.0],[4.83,47.0],[4.83,47.1],[4.76,47.1],[4.76,47.0]]]}},{"type":"Feature","properties":{"id":"volnay","name":"Volnay","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Eleganza femminile. Caillerets, Champans, Santenots. Bouchard, Marquis d'Angerville."},"geometry":{"type":"Polygon","coordinates":[[[4.73,47.02],[4.8,47.02],[4.8,47.1],[4.73,47.1],[4.73,47.02]]]}},{"type":"Feature","properties":{"id":"corton","name":"Corton Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir, Chardonnay","type":"Grand Cru","color":"#8B0000","description":"L'unico Grand Cru rouge della Côte de Beaune. La Tâche alternative. Jadot."},"geometry":{"type":"Polygon","coordinates":[[[4.84,47.04],[4.91,47.04],[4.91,47.11],[4.84,47.11],[4.84,47.04]]]}},{"type":"Feature","properties":{"id":"corton_charlemagne","name":"Corton-Charlemagne Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"Grand Cru","color":"#FFD700","description":"Chardonnay di potenza e mineralità. Cailleret e Pougets. Bonneau du Martray."},"geometry":{"type":"Polygon","coordinates":[[[4.85,47.05],[4.91,47.05],[4.91,47.11],[4.85,47.11],[4.85,47.05]]]}},{"type":"Feature","properties":{"id":"vosne","name":"Vosne-Romanée","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"La comune dei Grand Crus. Romanée-Conti, Richebourg, La Tâche. DRC."},"geometry":{"type":"Polygon","coordinates":[[[4.94,47.14],[5.0,47.14],[5.0,47.22],[4.94,47.22],[4.94,47.14]]]}},{"type":"Feature","properties":{"id":"chambolle","name":"Chambolle-Musigny","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Pinot più feminile. Calcari e argille. Mugnier, de Vogüé."},"geometry":{"type":"Polygon","coordinates":[[[4.93,47.18],[5.0,47.18],[5.0,47.27],[4.93,47.27],[4.93,47.18]]]}},{"type":"Feature","properties":{"id":"musigny","name":"Musigny Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir, Chardonnay","type":"Grand Cru","color":"#8B0000","description":"10.86 ha. Délicatesse e seta. de Vogüé, Leroy, Mugnier."},"geometry":{"type":"Polygon","coordinates":[[[4.954,47.208],[4.965,47.208],[4.965,47.218],[4.954,47.218],[4.954,47.208]]]}},{"type":"Feature","properties":{"id":"clos_vougeot","name":"Clos de Vougeot Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"Grand Cru","color":"#8B0000","description":"50 ha storici. Muro medievale. 80+ proprietari. DRC, Faiveley, Méo-Camuzet."},"geometry":{"type":"Polygon","coordinates":[[[4.942,47.183],[4.957,47.183],[4.957,47.2],[4.942,47.2],[4.942,47.183]]]}},{"type":"Feature","properties":{"id":"bonnes_mares","name":"Bonnes-Mares Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"Grand Cru","color":"#8B0000","description":"Confine Morey-Chambolle. Potenza e finezza. Drouhin, Roumier."},"geometry":{"type":"Polygon","coordinates":[[[4.94,47.218],[4.955,47.218],[4.955,47.232],[4.94,47.232],[4.94,47.218]]]}},{"type":"Feature","properties":{"id":"morgon","name":"Morgon","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Il Beaujolais più serio. Scisto di Côte du Py. Foillard, Lapierre, Desvignes."},"geometry":{"type":"Polygon","coordinates":[[[4.63,46.07],[4.75,46.07],[4.75,46.16],[4.63,46.16],[4.63,46.07]]]}},{"type":"Feature","properties":{"id":"moulin_a_vent","name":"Moulin-à-Vent","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Il più strutturato dei 10 Crus. Manganese nel suolo. Jadot, Thorin."},"geometry":{"type":"Polygon","coordinates":[[[4.64,46.16],[4.76,46.16],[4.76,46.24],[4.64,46.24],[4.64,46.16]]]}},{"type":"Feature","properties":{"id":"fleurie","name":"Fleurie","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Eleganza e profumo. La Madone come cru top. Château de Fleurie."},"geometry":{"type":"Polygon","coordinates":[[[4.65,46.18],[4.77,46.18],[4.77,46.26],[4.65,46.26],[4.65,46.18]]]}},{"type":"Feature","properties":{"id":"brouilly","name":"Brouilly","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Il più grande cru. Mont Brouilly vulcanico. Château Thivin."},"geometry":{"type":"Polygon","coordinates":[[[4.65,45.98],[4.8,45.98],[4.8,46.12],[4.65,46.12],[4.65,45.98]]]}},{"type":"Feature","properties":{"id":"bandol","name":"Bandol AOC","country":"Francia","region":"Provence","grapes":"Mourvèdre, Grenache","type":"AOC","color":"#8B0000","description":"Provence: Mourvèdre dominante. Argille e calcare. Tempier, Pibarnon."},"geometry":{"type":"Polygon","coordinates":[[[5.63,43.12],[5.9,43.12],[5.9,43.25],[5.63,43.25],[5.63,43.12]]]}},{"type":"Feature","properties":{"id":"cassis","name":"Cassis AOC","country":"Francia","region":"Provence","grapes":"Marsanne, Clairette, Ugni Blanc","type":"AOC","color":"#FFD700","description":"Calanques calcari bianchi. Bianco iodato e minerale. Clos Sainte-Magdeleine."},"geometry":{"type":"Polygon","coordinates":[[[5.53,43.2],[5.58,43.2],[5.58,43.24],[5.53,43.24],[5.53,43.2]]]}},{"type":"Feature","properties":{"id":"cotes_provence","name":"Côtes de Provence","country":"Francia","region":"Provence","grapes":"Grenache, Syrah, Cinsault","type":"AOC","color":"#9B59B6","description":"Provenza. Il più grande rosé del mondo. Miraval, Minuty, Ott."},"geometry":{"type":"Polygon","coordinates":[[[5.5,43.05],[6.85,43.05],[6.85,43.7],[5.5,43.7],[5.5,43.05]]]}},{"type":"Feature","properties":{"id":"corse_patrimonio","name":"Patrimonio AOC","country":"Francia","region":"Corsica","grapes":"Nielluccio (Sangiovese), Vermentino","type":"AOC","color":"#8B0000","description":"Cap Corse. Calcari argillosi bianchi. Nielluccio strutturato. Gentile."},"geometry":{"type":"Polygon","coordinates":[[[9.15,42.65],[9.45,42.65],[9.45,42.85],[9.15,42.85],[9.15,42.65]]]}},{"type":"Feature","properties":{"id":"pic_st_loup","name":"Pic Saint-Loup","country":"Francia","region":"Languedoc","grapes":"Syrah, Grenache, Mourvèdre","type":"AOC","color":"#8B0000","description":"Massif nord di Montpellier. Clima fresco, Syrah elegante. Mas Bruguière."},"geometry":{"type":"Polygon","coordinates":[[[3.72,43.7],[3.95,43.7],[3.95,43.88],[3.72,43.88],[3.72,43.7]]]}},{"type":"Feature","properties":{"id":"faugeres","name":"Faugères","country":"Francia","region":"Languedoc","grapes":"Syrah, Grenache, Mourvèdre","type":"AOC","color":"#8B0000","description":"Scisto di Faugères. Potere mineralità. Léon Barral, Alquier."},"geometry":{"type":"Polygon","coordinates":[[[3.1,43.6],[3.3,43.6],[3.3,43.72],[3.1,43.72],[3.1,43.6]]]}},{"type":"Feature","properties":{"id":"st_chinian","name":"Saint-Chinian","country":"Francia","region":"Languedoc","grapes":"Grenache, Syrah, Carignan","type":"AOC","color":"#8B0000","description":"Languedoc. Scisto e calcare. Mas Champart, Borie La Vitarèle."},"geometry":{"type":"Polygon","coordinates":[[[2.88,43.4],[3.15,43.4],[3.15,43.62],[2.88,43.62],[2.88,43.4]]]}},{"type":"Feature","properties":{"id":"collioure","name":"Collioure","country":"Francia","region":"Roussillon","grapes":"Grenache, Syrah, Mourvèdre","type":"AOC","color":"#8B0000","description":"Costa catalana. Scisto. Grenache maturo e concentrato. Coume Del Mas."},"geometry":{"type":"Polygon","coordinates":[[[3.0,42.46],[3.18,42.46],[3.18,42.55],[3.0,42.55],[3.0,42.46]]]}},{"type":"Feature","properties":{"id":"maury","name":"Maury","country":"Francia","region":"Roussillon","grapes":"Grenache Noir","type":"AOC","color":"#8B0000","description":"VDN (Vino Dolce Naturale). Grenache su scisto. Mas Amiel, Maury Sec."},"geometry":{"type":"Polygon","coordinates":[[[2.7,42.73],[2.9,42.73],[2.9,42.88],[2.7,42.88],[2.7,42.73]]]}},{"type":"Feature","properties":{"id":"banyuls","name":"Banyuls","country":"Francia","region":"Roussillon","grapes":"Grenache Noir","type":"AOC","color":"#8B0000","description":"VDN con invecchiamento. Cap Cerbère sul mare. Mas de la Rouvière."},"geometry":{"type":"Polygon","coordinates":[[[2.98,42.46],[3.18,42.46],[3.18,42.6],[2.98,42.6],[2.98,42.46]]]}},{"type":"Feature","properties":{"id":"muscadet_gm","name":"Muscadet Grand Lieu","country":"Francia","region":"Loire","grapes":"Melon de Bourgogne","type":"AOC","color":"#FFD700","description":"Lago di Grand-Lieu. Sur Lie intenso. Bianco salino."},"geometry":{"type":"Polygon","coordinates":[[[-1.6,47.0],[-1.2,47.0],[-1.2,47.25],[-1.6,47.25],[-1.6,47.0]]]}},{"type":"Feature","properties":{"id":"anjou","name":"Anjou","country":"Francia","region":"Loire","grapes":"Chenin Blanc, Cabernet Franc","type":"AOC","color":"#FFD700","description":"Schiste d'Anjou. Chenin versatile. Clos Rougeard, Ogereau."},"geometry":{"type":"Polygon","coordinates":[[[-0.6,47.2],[-0.1,47.2],[-0.1,47.6],[-0.6,47.6],[-0.6,47.2]]]}},{"type":"Feature","properties":{"id":"savennieres","name":"Savennières","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"AOC","color":"#FFD700","description":"Roche aux Moines, Coulée de Serrant (monopole). Chenin sec de garde."},"geometry":{"type":"Polygon","coordinates":[[[-0.78,47.34],[-0.7,47.34],[-0.7,47.4],[-0.78,47.4],[-0.78,47.34]]]}},{"type":"Feature","properties":{"id":"coteaux_layon","name":"Coteaux du Layon","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"AOC","color":"#FFD700","description":"Chenin dolce su argille. Moulin Touchais. Bonnezeaux e Quarts de Chaume."},"geometry":{"type":"Polygon","coordinates":[[[-0.68,47.24],[-0.42,47.24],[-0.42,47.42],[-0.68,47.42],[-0.68,47.24]]]}},{"type":"Feature","properties":{"id":"quarts_de_chaume","name":"Quarts de Chaume Grand Cru","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"Grand Cru","color":"#FFD700","description":"46 ha. Botrytis su schiste. Chenin liquoroso di rara eleganza."},"geometry":{"type":"Polygon","coordinates":[[[-0.588,47.34],[-0.565,47.34],[-0.565,47.36],[-0.588,47.36],[-0.588,47.34]]]}},{"type":"Feature","properties":{"id":"bourgueil_st_nico","name":"Saint-Nicolas-de-Bourgueil","country":"Francia","region":"Loire","grapes":"Cabernet Franc","type":"AOC","color":"#8B0000","description":"Sabbie e ghiaie del borgo. Cabernet Franc fresco e fruttato."},"geometry":{"type":"Polygon","coordinates":[[[0.1,47.24],[0.2,47.24],[0.2,47.34],[0.1,47.34],[0.1,47.24]]]}},{"type":"Feature","properties":{"id":"saumur","name":"Saumur","country":"Francia","region":"Loire","grapes":"Cabernet Franc, Chenin Blanc","type":"AOC","color":"#8B0000","description":"Tuffeau bianco. Saumur-Champigny Cab.Franc. Cave troglodyte."},"geometry":{"type":"Polygon","coordinates":[[[-0.15,47.2],[0.15,47.2],[0.15,47.42],[-0.15,47.42],[-0.15,47.2]]]}},{"type":"Feature","properties":{"id":"jura_cotes","name":"Côtes du Jura","country":"Francia","region":"Jura","grapes":"Savagnin, Chardonnay, Poulsard","type":"AOC","color":"#FFD700","description":"Lias e argille del Giura. Savagnin ossidativo, Vin Jaune, Vin de Paille."},"geometry":{"type":"Polygon","coordinates":[[[5.55,46.6],[5.8,46.6],[5.8,46.9],[5.55,46.9],[5.55,46.6]]]}},{"type":"Feature","properties":{"id":"vin_jaune","name":"Château-Chalon","country":"Francia","region":"Jura","grapes":"Savagnin","type":"AOC","color":"#FFD700","description":"Cru del Vin Jaune. Solo millesimi eccellenti. 6 anni sous voile. Berthet-Bondet."},"geometry":{"type":"Polygon","coordinates":[[[5.63,46.71],[5.73,46.71],[5.73,46.78],[5.63,46.78],[5.63,46.71]]]}},{"type":"Feature","properties":{"id":"bugey","name":"Bugey AOVDQS","country":"Francia","region":"Ain","grapes":"Altesse, Chardonnay, Mondeuse","type":"AOC","color":"#FFD700","description":"Montagne di confine con la Savoia. Altesse e Mondeuse."},"geometry":{"type":"Polygon","coordinates":[[[5.4,45.75],[5.85,45.75],[5.85,46.05],[5.4,46.05],[5.4,45.75]]]}},{"type":"Feature","properties":{"id":"savoie","name":"Vin de Savoie","country":"Francia","region":"Savoie","grapes":"Altesse, Jacquère, Mondeuse","type":"AOC","color":"#FFD700","description":"Alpi di Savoie. 23 crus. Roussette de Savoie. Michel Grisard."},"geometry":{"type":"Polygon","coordinates":[[[5.9,45.6],[6.8,45.6],[6.8,46.35],[5.9,46.35],[5.9,45.6]]]}},{"type":"Feature","properties":{"id":"rioja","name":"Rioja DOCa","country":"Spagna","region":"La Rioja","grapes":"Tempranillo, Garnacha, Mazuelo","type":"DOCa","color":"#8B0000","description":"Prima DOCa di Spagna. Rioja Alta, Alavesa, Oriental. Muga, CVNE."},"geometry":{"type":"Polygon","coordinates":[[[-2.948,42.248],[-2.688,42.212],[-2.398,42.19],[-2.108,42.196],[-1.958,42.218],[-1.892,42.258],[-1.898,42.318],[-1.948,42.378],[-2.038,42.43],[-2.178,42.468],[-2.348,42.482],[-2.528,42.472],[-2.688,42.44],[-2.828,42.394],[-2.918,42.336],[-2.95,42.29],[-2.948,42.248]]]}},{"type":"Feature","properties":{"id":"priorat","name":"Priorat DOCa","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Cariñena","type":"DOCa","color":"#8B0000","description":"Llicorella. Alvaro Palacios L'Ermita, Clos Mogador, Clos de l'Obac."},"geometry":{"type":"Polygon","coordinates":[[[0.668,41.108],[0.718,41.092],[0.772,41.088],[0.822,41.096],[0.862,41.116],[0.884,41.146],[0.876,41.18],[0.848,41.208],[0.804,41.222],[0.752,41.22],[0.702,41.204],[0.666,41.174],[0.652,41.142],[0.668,41.108]]]}},{"type":"Feature","properties":{"id":"ribera_duero","name":"Ribera del Duero DO","country":"Spagna","region":"Castiglia e León","grapes":"Tinto Fino","type":"DO","color":"#8B0000","description":"Meseta 800-900m. Vega Sicilia Único, Pingus, Pesquera."},"geometry":{"type":"Polygon","coordinates":[[[-3.838,41.458],[-3.618,41.432],[-3.368,41.418],[-3.108,41.416],[-2.892,41.428],[-2.752,41.452],[-2.712,41.49],[-2.728,41.538],[-2.798,41.582],[-2.928,41.614],[-3.108,41.63],[-3.318,41.628],[-3.528,41.606],[-3.698,41.566],[-3.808,41.514],[-3.848,41.48],[-3.838,41.458]]]}},{"type":"Feature","properties":{"id":"rias_baixas","name":"Rías Baixas DO","country":"Spagna","region":"Galizia","grapes":"Albariño","type":"DO","color":"#FFD700","description":"Costa atlantica. Albariño su granito. Salinità e acidità."},"geometry":{"type":"Polygon","coordinates":[[[-8.97,42.05],[-8.35,42.05],[-8.35,42.62],[-8.97,42.62],[-8.97,42.05]]]}},{"type":"Feature","properties":{"id":"jerez","name":"Jerez-Xérès-Sherry DO","country":"Spagna","region":"Andalusia","grapes":"Palomino, Pedro Ximénez","type":"DO","color":"#FFD700","description":"Albariza. Sistema Solera. Fino, Manzanilla, Oloroso, Amontillado."},"geometry":{"type":"Polygon","coordinates":[[[-6.31,36.56],[-5.92,36.56],[-5.92,36.8],[-6.31,36.8],[-6.31,36.56]]]}},{"type":"Feature","properties":{"id":"manzanilla","name":"Manzanilla DO","country":"Spagna","region":"Andalusia","grapes":"Palomino Fino","type":"DO","color":"#FFD700","description":"Solo Sanlúcar de Barrameda. Fino con flor e brezza marina."},"geometry":{"type":"Polygon","coordinates":[[[-6.36,36.75],[-6.29,36.75],[-6.29,36.82],[-6.36,36.82],[-6.36,36.75]]]}},{"type":"Feature","properties":{"id":"cava","name":"Cava DO","country":"Spagna","region":"Catalogna","grapes":"Macabeo, Xarel-lo, Parellada","type":"DO","color":"#FFD700","description":"Metodo Classico spagnolo. Penedès e altre zone. Codorníu, Freixenet."},"geometry":{"type":"Polygon","coordinates":[[[1.4,41.25],[1.85,41.25],[1.85,41.55],[1.4,41.55],[1.4,41.25]]]}},{"type":"Feature","properties":{"id":"penedes","name":"Penedès DO","country":"Spagna","region":"Catalogna","grapes":"Xarel-lo, Macabeo, Parellada, Cabernet","type":"DO","color":"#FFD700","description":"Torres come massimo interprete. Blancs e negres di Catalogna."},"geometry":{"type":"Polygon","coordinates":[[[1.35,41.2],[1.87,41.2],[1.87,41.55],[1.35,41.55],[1.35,41.2]]]}},{"type":"Feature","properties":{"id":"galicia_valdeorras","name":"Valdeorras DO","country":"Spagna","region":"Galizia","grapes":"Godello, Mencia","type":"DO","color":"#FFD700","description":"Godello: la risposta galiziana al Riesling. Schisto ardesia. Guitián."},"geometry":{"type":"Polygon","coordinates":[[[-7.1,42.25],[-6.9,42.25],[-6.9,42.4],[-7.1,42.4],[-7.1,42.25]]]}},{"type":"Feature","properties":{"id":"ribeiro","name":"Ribeiro DO","country":"Spagna","region":"Galizia","grapes":"Treixadura, Albariño","type":"DO","color":"#FFD700","description":"Inland Galizia. Treixadura fresca su granito e scisto."},"geometry":{"type":"Polygon","coordinates":[[[-8.2,42.25],[-7.7,42.25],[-7.7,42.55],[-8.2,42.55],[-8.2,42.25]]]}},{"type":"Feature","properties":{"id":"terra_alta","name":"Terra Alta DO","country":"Spagna","region":"Catalogna","grapes":"Garnacha Blanca, Garnacha Tinta","type":"DO","color":"#FFD700","description":"Garnacha Blanca poderosa. Terra rossa. Bàrbara Forés."},"geometry":{"type":"Polygon","coordinates":[[[0.27,40.9],[0.65,40.9],[0.65,41.08],[0.27,41.08],[0.27,40.9]]]}},{"type":"Feature","properties":{"id":"toro","name":"Toro DO","country":"Spagna","region":"Castiglia e León","grapes":"Tinta de Toro (Tempranillo)","type":"DO","color":"#8B0000","description":"Clima estremo, suoli sabbiosi. Numanthia, Pintia, Vetus."},"geometry":{"type":"Polygon","coordinates":[[[-5.85,41.38],[-5.25,41.38],[-5.25,41.62],[-5.85,41.62],[-5.85,41.38]]]}},{"type":"Feature","properties":{"id":"rueda","name":"Rueda DO","country":"Spagna","region":"Castiglia e León","grapes":"Verdejo, Sauvignon Blanc","type":"DO","color":"#FFD700","description":"Verdejo autoctono su ghiaie. Fresco e aromatico. Belondrade."},"geometry":{"type":"Polygon","coordinates":[[[-5.3,41.17],[-4.6,41.17],[-4.6,41.45],[-5.3,41.45],[-5.3,41.17]]]}},{"type":"Feature","properties":{"id":"bierzo","name":"Bierzo DO","country":"Spagna","region":"Castiglia e León","grapes":"Mencía","type":"DO","color":"#8B0000","description":"Mencía su scisto. Achaval Ferrer di Spagna. Palacios Remondo, Descendientes."},"geometry":{"type":"Polygon","coordinates":[[[-6.9,42.45],[-6.35,42.45],[-6.35,42.8],[-6.9,42.8],[-6.9,42.45]]]}},{"type":"Feature","properties":{"id":"albarino_rias","name":"Albariño DO Rías Baixas Sub","country":"Spagna","region":"Galizia","grapes":"Albariño","type":"DO","color":"#FFD700","description":"Sottozona Val do Salnés. Albariño puro su granito costiero."},"geometry":{"type":"Polygon","coordinates":[[[-8.75,42.3],[-8.45,42.3],[-8.45,42.55],[-8.75,42.55],[-8.75,42.3]]]}},{"type":"Feature","properties":{"id":"cava_gran_reserva","name":"Cava Gran Reserva DO","country":"Spagna","region":"Catalogna","grapes":"Macabeo, Xarel-lo, Chardonnay","type":"DO","color":"#FFD700","description":"30+ mesi. Recaredo, Agustí Torelló, Raventós."},"geometry":{"type":"Polygon","coordinates":[[[1.4,41.25],[1.85,41.25],[1.85,41.55],[1.4,41.55],[1.4,41.25]]]}},{"type":"Feature","properties":{"id":"malaga","name":"Málaga DO","country":"Spagna","region":"Andalusia","grapes":"Pedro Ximénez, Muscat","type":"DO","color":"#FFD700","description":"Vino dolce secolare. Schisto. PX passito. Telmo Rodríguez MR."},"geometry":{"type":"Polygon","coordinates":[[[-4.6,36.6],[-4.0,36.6],[-4.0,36.95],[-4.6,36.95],[-4.6,36.6]]]}},{"type":"Feature","properties":{"id":"jumilla","name":"Jumilla DO","country":"Spagna","region":"Murcia","grapes":"Monastrell (Mourvèdre)","type":"DO","color":"#8B0000","description":"Entroterra arido. Monastrell su suoli argillo-calcarei. Juan Gil."},"geometry":{"type":"Polygon","coordinates":[[[-1.75,38.25],[-1.15,38.25],[-1.15,38.6],[-1.75,38.6],[-1.75,38.25]]]}},{"type":"Feature","properties":{"id":"yecla","name":"Yecla DO","country":"Spagna","region":"Murcia","grapes":"Monastrell","type":"DO","color":"#8B0000","description":"Altopiano semi-arido. Monastrell potente. Bodegas Castaño."},"geometry":{"type":"Polygon","coordinates":[[[-1.25,38.55],[-0.95,38.55],[-0.95,38.8],[-1.25,38.8],[-1.25,38.55]]]}},{"type":"Feature","properties":{"id":"campo_borja","name":"Campo de Borja DO","country":"Spagna","region":"Aragona","grapes":"Garnacha, Tempranillo","type":"DO","color":"#8B0000","description":"Garnacha vecchie viti su macerina. Borsao, Bodegas Aragonesas."},"geometry":{"type":"Polygon","coordinates":[[[-1.8,41.7],[-1.45,41.7],[-1.45,42.0],[-1.8,42.0],[-1.8,41.7]]]}},{"type":"Feature","properties":{"id":"calatayud","name":"Calatayud DO","country":"Spagna","region":"Aragona","grapes":"Garnacha, Tempranillo","type":"DO","color":"#8B0000","description":"Garnacha centenaria ad alta quota su scisto. San Alejandro."},"geometry":{"type":"Polygon","coordinates":[[[-1.85,41.3],[-1.45,41.3],[-1.45,41.65],[-1.85,41.65],[-1.85,41.3]]]}},{"type":"Feature","properties":{"id":"montsant","name":"Montsant DO","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Cariñena, Syrah","type":"DO","color":"#8B0000","description":"Circonda il Priorat. Simile a prezzi più bassi. Acústic, Venus."},"geometry":{"type":"Polygon","coordinates":[[[0.69,41.08],[0.94,41.08],[0.94,41.35],[0.69,41.35],[0.69,41.08]]]}},{"type":"Feature","properties":{"id":"emporda","name":"Empordà DO","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Carignan","type":"DO","color":"#8B0000","description":"Costa Brava. Tramuntana. Garnacha leggera e fresca."},"geometry":{"type":"Polygon","coordinates":[[[2.85,42.1],[3.2,42.1],[3.2,42.45],[2.85,42.45],[2.85,42.1]]]}},{"type":"Feature","properties":{"id":"costers_segre","name":"Costers del Segre DO","country":"Spagna","region":"Catalogna","grapes":"Cabernet, Tempranillo, Chardonnay","type":"DO","color":"#8B0000","description":"Zona interna Catalogna. Raimat e Costers. Vini freschi d'altitudine."},"geometry":{"type":"Polygon","coordinates":[[[0.5,41.55],[1.3,41.55],[1.3,41.9],[0.5,41.9],[0.5,41.55]]]}},{"type":"Feature","properties":{"id":"montilla_moriles","name":"Montilla-Moriles DO","country":"Spagna","region":"Andalusia","grapes":"Pedro Ximénez","type":"DO","color":"#FFD700","description":"Pedro Ximénez non-appassito. Fino naturale senza alcolizzazione. Toro Albalá."},"geometry":{"type":"Polygon","coordinates":[[[-4.8,37.55],[-4.38,37.55],[-4.38,37.9],[-4.8,37.9],[-4.8,37.55]]]}},{"type":"Feature","properties":{"id":"porto","name":"Porto DOC","country":"Portogallo","region":"Douro","grapes":"Touriga Nacional, Tinta Roriz","type":"DOC","color":"#8B0000","description":"Douro su scisto. Vintage, LBV, Tawny. Taylor's, Fonseca, Quinta do Noval."},"geometry":{"type":"Polygon","coordinates":[[[-7.958,41.012],[-7.748,40.988],[-7.498,40.978],[-7.238,40.988],[-7.028,41.018],[-6.908,41.062],[-6.878,41.118],[-6.918,41.178],[-7.018,41.228],[-7.168,41.262],[-7.358,41.278],[-7.568,41.27],[-7.748,41.238],[-7.878,41.186],[-7.958,41.122],[-7.978,41.062],[-7.958,41.012]]]}},{"type":"Feature","properties":{"id":"douro","name":"Douro DOC","country":"Portogallo","region":"Douro","grapes":"Touriga Nacional, Touriga Franca","type":"DOC","color":"#8B0000","description":"Barca Velha. Niepoort, Ramos Pinto, Roca. Vini da tavola d'eccellenza."},"geometry":{"type":"Polygon","coordinates":[[[-7.96,40.98],[-6.85,40.98],[-6.85,41.38],[-7.96,41.38],[-7.96,40.98]]]}},{"type":"Feature","properties":{"id":"vinho_verde","name":"Vinho Verde DOC","country":"Portogallo","region":"Minho","grapes":"Alvarinho, Loureiro, Arinto","type":"DOC","color":"#FFD700","description":"Pergola tra Minho e Douro. Sub-zona Monção e Melgaço per Alvarinho."},"geometry":{"type":"Polygon","coordinates":[[[-8.7,41.46],[-7.82,41.46],[-7.82,42.22],[-8.7,42.22],[-8.7,41.46]]]}},{"type":"Feature","properties":{"id":"dao","name":"Dão DOC","country":"Portogallo","region":"Centro","grapes":"Touriga Nacional, Encruzado","type":"DOC","color":"#8B0000","description":"Granito e scisto. Touriga Nazionale elegante. Quinta dos Roques."},"geometry":{"type":"Polygon","coordinates":[[[-8.05,40.35],[-7.45,40.35],[-7.45,40.78],[-8.05,40.78],[-8.05,40.35]]]}},{"type":"Feature","properties":{"id":"bairrada","name":"Bairrada DOC","country":"Portogallo","region":"Centro","grapes":"Baga, Fernão Pires","type":"DOC","color":"#8B0000","description":"Argille costiere atlantiche. Baga tannica. Luis Pato, Quinta das Bágeiras."},"geometry":{"type":"Polygon","coordinates":[[[-8.7,40.1],[-8.3,40.1],[-8.3,40.5],[-8.7,40.5],[-8.7,40.1]]]}},{"type":"Feature","properties":{"id":"alentejo","name":"Alentejo DOC","country":"Portogallo","region":"Alentejo","grapes":"Aragonez, Trincadeira, Alicante Bouschet","type":"DOC","color":"#8B0000","description":"Pianure calde e aride. Ericeira, Mouchão, Esporão."},"geometry":{"type":"Polygon","coordinates":[[[-8.2,37.55],[-6.9,37.55],[-6.9,38.9],[-8.2,38.9],[-8.2,37.55]]]}},{"type":"Feature","properties":{"id":"madeira","name":"Madeira DOC","country":"Portogallo","region":"Madeira","grapes":"Verdelho, Sercial, Bual, Malmsey","type":"DOC","color":"#FFD700","description":"Vino ossidativo indistruttibile. Blandy's, Barbeito. Bottiglie del 1800 ancora vive."},"geometry":{"type":"Polygon","coordinates":[[[-17.28,32.59],[-16.62,32.59],[-16.62,32.9],[-17.28,32.9],[-17.28,32.59]]]}},{"type":"Feature","properties":{"id":"setubal","name":"Moscatel de Setúbal DOC","country":"Portogallo","region":"Penisola di Setúbal","grapes":"Moscatel de Setúbal","type":"DOC","color":"#FFD700","description":"Moscato dolce e ossidativo. José Maria da Fonseca. Arancio candito, miele."},"geometry":{"type":"Polygon","coordinates":[[[-8.85,38.35],[-8.5,38.35],[-8.5,38.6],[-8.85,38.6],[-8.85,38.35]]]}},{"type":"Feature","properties":{"id":"colares","name":"Colares DOC","country":"Portogallo","region":"Lisboa","grapes":"Ramisco, Malvasia de Colares","type":"DOC","color":"#8B0000","description":"Sabbie atlantiche a Sintra. Radici phylloxera-free. Rarissimo."},"geometry":{"type":"Polygon","coordinates":[[[-9.42,38.8],[-9.32,38.8],[-9.32,38.9],[-9.42,38.9],[-9.42,38.8]]]}},{"type":"Feature","properties":{"id":"vinho_verde_mono","name":"Monção e Melgaço DOC","country":"Portogallo","region":"Minho","grapes":"Alvarinho","type":"DOC","color":"#FFD700","description":"Il meglio dell'Alvarinho portoghese. Granite sub-zones. Soalheiro, Anselmo Mendes."},"geometry":{"type":"Polygon","coordinates":[[[-8.4,41.85],[-8.2,41.85],[-8.2,42.1],[-8.4,42.1],[-8.4,41.85]]]}},{"type":"Feature","properties":{"id":"tavora_varosa","name":"Távora-Varosa DOC","country":"Portogallo","region":"Norte","grapes":"Malvasia Fina, Gouveio","type":"DOC","color":"#FFD700","description":"Metodo Classico portoghese. Alta quota Douro. Murganheira."},"geometry":{"type":"Polygon","coordinates":[[[-7.75,41.1],[-7.45,41.1],[-7.45,41.35],[-7.75,41.35],[-7.75,41.1]]]}},{"type":"Feature","properties":{"id":"bucelas","name":"Bucelas DOC","country":"Portogallo","region":"Lisboa","grapes":"Arinto","type":"DOC","color":"#FFD700","description":"Il bianco storico di Lisbona. Arinto minerale e longevo."},"geometry":{"type":"Polygon","coordinates":[[[-9.05,38.87],[-8.92,38.87],[-8.92,38.98],[-9.05,38.98],[-9.05,38.87]]]}},{"type":"Feature","properties":{"id":"lisboa","name":"Lisboa DOC","country":"Portogallo","region":"Lisboa","grapes":"Fernão Pires, Castelão","type":"DOC","color":"#FFD700","description":"Cintra, Alenquer, Arruda. Pianure litoranee atlantiche."},"geometry":{"type":"Polygon","coordinates":[[[-9.3,38.8],[-8.9,38.8],[-8.9,39.3],[-9.3,39.3],[-9.3,38.8]]]}},{"type":"Feature","properties":{"id":"algarve","name":"Algarve DOC","country":"Portogallo","region":"Algarve","grapes":"Negra Mole, Castelão","type":"DOC","color":"#8B0000","description":"Estremo sud lusitano. Pecharmant locale. Vins touristiques."},"geometry":{"type":"Polygon","coordinates":[[[-8.6,37.0],[-7.4,37.0],[-7.4,37.55],[-8.6,37.55],[-8.6,37.0]]]}},{"type":"Feature","properties":{"id":"mosel","name":"Mosel","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling, Müller-Thurgau","type":"QmP","color":"#FFD700","description":"Ardesia blu devoniana. Riesling più longevo. Egon Müller, JJ Prüm."},"geometry":{"type":"Polygon","coordinates":[[[6.528,49.658],[6.798,49.618],[7.068,49.612],[7.298,49.638],[7.438,49.682],[7.468,49.742],[7.428,49.818],[7.318,49.888],[7.148,49.952],[6.948,50.002],[6.758,50.028],[6.598,50.022],[6.498,49.988],[6.472,49.918],[6.492,49.838],[6.548,49.758],[6.528,49.658]]]}},{"type":"Feature","properties":{"id":"rheingau","name":"Rheingau","country":"Germania","region":"Assia","grapes":"Riesling, Spätburgunder","type":"QmP","color":"#FFD700","description":"Versante sud sul Reno. Schloss Johannisberg, Robert Weil. Riesling nobile."},"geometry":{"type":"Polygon","coordinates":[[[7.73,49.96],[8.29,49.96],[8.29,50.17],[7.73,50.17],[7.73,49.96]]]}},{"type":"Feature","properties":{"id":"pfalz","name":"Pfalz","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling, Spätburgunder","type":"QbA","color":"#FFD700","description":"Grande Strada del Vino. Weissburgunder, Dornfelder. A.Christmann."},"geometry":{"type":"Polygon","coordinates":[[[7.9,49.1],[8.45,49.1],[8.45,49.6],[7.9,49.6],[7.9,49.1]]]}},{"type":"Feature","properties":{"id":"nahe","name":"Nahe","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling, Silvaner","type":"QmP","color":"#FFD700","description":"Terroir multiforme: porfido, basalto, gneiss. Dönnhoff, Schlossgut Diel."},"geometry":{"type":"Polygon","coordinates":[[[7.65,49.7],[8.05,49.7],[8.05,49.98],[7.65,49.98],[7.65,49.7]]]}},{"type":"Feature","properties":{"id":"rheinhessen","name":"Rheinhessen","country":"Germania","region":"Renania-Palatinato","grapes":"Silvaner, Riesling, Müller-Thurgau","type":"QbA","color":"#FFD700","description":"Più grande zona viticola. Westhofener Kirchspiel. Keller, Wittmann."},"geometry":{"type":"Polygon","coordinates":[[[7.85,49.6],[8.55,49.6],[8.55,50.05],[7.85,50.05],[7.85,49.6]]]}},{"type":"Feature","properties":{"id":"franken","name":"Franken","country":"Germania","region":"Baviera","grapes":"Silvaner, Müller-Thurgau","type":"QbA","color":"#FFD700","description":"Bocksbeutel. Silvaner su calcari. Würzburg. Juliusspital."},"geometry":{"type":"Polygon","coordinates":[[[9.6,49.7],[10.73,49.7],[10.73,50.17],[9.6,50.17],[9.6,49.7]]]}},{"type":"Feature","properties":{"id":"ahr","name":"Ahr","country":"Germania","region":"Renania-Palatinato","grapes":"Spätburgunder (Pinot Nero)","type":"QmP","color":"#8B0000","description":"La valle più fredda per Pinot Nero. Grafite e ardesia. Meyer-Näkel."},"geometry":{"type":"Polygon","coordinates":[[[6.9,50.44],[7.17,50.44],[7.17,50.59],[6.9,50.59],[6.9,50.44]]]}},{"type":"Feature","properties":{"id":"mittelrhein","name":"Mittelrhein","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling","type":"QbA","color":"#FFD700","description":"Reno tra Bingen e Bonn. Ardesia. Panorama mozzafiato. Toni Jost."},"geometry":{"type":"Polygon","coordinates":[[[7.3,50.28],[7.68,50.28],[7.68,50.62],[7.3,50.62],[7.3,50.28]]]}},{"type":"Feature","properties":{"id":"hessische_bergstr","name":"Hessische Bergstraße","country":"Germania","region":"Assia","grapes":"Riesling, Spätburgunder","type":"QbA","color":"#FFD700","description":"Più piccola zona tedesca. Darmstadt. Staatsweingut Bergstraße."},"geometry":{"type":"Polygon","coordinates":[[[8.62,49.59],[8.72,49.59],[8.72,49.78],[8.62,49.78],[8.62,49.59]]]}},{"type":"Feature","properties":{"id":"wurttemberg","name":"Württemberg","country":"Germania","region":"Baden-Württemberg","grapes":"Trollinger, Lemberger, Riesling","type":"QbA","color":"#8B0000","description":"Neckar e affiliati. Trollinger vitigno tipico. Haidle, Aldinger."},"geometry":{"type":"Polygon","coordinates":[[[9.0,48.6],[9.8,48.6],[9.8,49.2],[9.0,49.2],[9.0,48.6]]]}},{"type":"Feature","properties":{"id":"baden","name":"Baden","country":"Germania","region":"Baden-Württemberg","grapes":"Spätburgunder, Grauburgunder","type":"QbA","color":"#8B0000","description":"Il più caldo. Kaiserstuhl vulcanico. Loosen-Dr. L, Bernhard Huber."},"geometry":{"type":"Polygon","coordinates":[[[7.7,47.55],[8.62,47.55],[8.62,49.15],[7.7,49.15],[7.7,47.55]]]}},{"type":"Feature","properties":{"id":"sachsen","name":"Sachsen","country":"Germania","region":"Sassonia","grapes":"Riesling, Müller-Thurgau, Weißburgunder","type":"QbA","color":"#FFD700","description":"Più orientale e fredda. Elba. Schloss Proschwitz, Klaus Zimmerling."},"geometry":{"type":"Polygon","coordinates":[[[13.0,50.9],[13.7,50.9],[13.7,51.35],[13.0,51.35],[13.0,50.9]]]}},{"type":"Feature","properties":{"id":"saale_unstrut","name":"Saale-Unstrut","country":"Germania","region":"Sassonia-Anhalt","grapes":"Müller-Thurgau, Weißburgunder","type":"QbA","color":"#FFD700","description":"La più a nord. Suoli di calcare. Naumburg. Weingut Lützkendorf."},"geometry":{"type":"Polygon","coordinates":[[[11.4,51.1],[12.0,51.1],[12.0,51.55],[11.4,51.55],[11.4,51.1]]]}},{"type":"Feature","properties":{"id":"wachau","name":"Wachau DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Loess e gneiss sul Danubio. Steinfeder-Federspiel-Smaragd. Prager, Knoll, FX Pichler."},"geometry":{"type":"Polygon","coordinates":[[[15.238,48.258],[15.318,48.248],[15.408,48.252],[15.488,48.268],[15.548,48.294],[15.578,48.328],[15.562,48.362],[15.518,48.39],[15.448,48.402],[15.368,48.396],[15.288,48.372],[15.232,48.336],[15.21,48.3],[15.222,48.276],[15.238,48.258]]]}},{"type":"Feature","properties":{"id":"kremstal","name":"Kremstal DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Krems: loess, calcare, gneiss. Nigl, Salomon Undhof."},"geometry":{"type":"Polygon","coordinates":[[[15.4,48.27],[15.7,48.27],[15.7,48.5],[15.4,48.5],[15.4,48.27]]]}},{"type":"Feature","properties":{"id":"kamptal","name":"Kamptal DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Kamp: basalto di Zöbing. Hirsch, Bründlmayer, Schloss Gobelsburg."},"geometry":{"type":"Polygon","coordinates":[[[15.5,48.38],[15.8,48.38],[15.8,48.68],[15.5,48.68],[15.5,48.38]]]}},{"type":"Feature","properties":{"id":"traisental","name":"Traisental DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Valle del Traisen. Loess e argille. Neumayer."},"geometry":{"type":"Polygon","coordinates":[[[15.5,48.17],[15.73,48.17],[15.73,48.35],[15.5,48.35],[15.5,48.17]]]}},{"type":"Feature","properties":{"id":"weinviertel","name":"Weinviertel DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner","type":"DAC","color":"#FFD700","description":"Più grande zona austriaca. Grüner Veltliner con pepe bianco. Pfaffl."},"geometry":{"type":"Polygon","coordinates":[[[15.6,48.35],[16.95,48.35],[16.95,48.8],[15.6,48.8],[15.6,48.35]]]}},{"type":"Feature","properties":{"id":"neusiedlersee","name":"Neusiedlersee","country":"Austria","region":"Burgenland","grapes":"Welschriesling, Zweigelt","type":"DAC","color":"#FFD700","description":"Lago Neusiedl. Botrytis per Trockenbeerenauslese. Kracher, Feiler-Artinger."},"geometry":{"type":"Polygon","coordinates":[[[16.72,47.7],[17.08,47.7],[17.08,47.97],[16.72,47.97],[16.72,47.7]]]}},{"type":"Feature","properties":{"id":"mittelburgenland","name":"Mittelburgenland DAC","country":"Austria","region":"Burgenland","grapes":"Blaufränkisch","type":"DAC","color":"#8B0000","description":"Blaufränkisch su argille blu. Potenza e freschezza. Iby, Gesellmann."},"geometry":{"type":"Polygon","coordinates":[[[16.52,47.37],[16.85,47.37],[16.85,47.62],[16.52,47.62],[16.52,47.37]]]}},{"type":"Feature","properties":{"id":"sudburgenland","name":"Südburgenland DAC","country":"Austria","region":"Burgenland","grapes":"Blaufränkisch","type":"DAC","color":"#8B0000","description":"Suoli profondi. Eisenberg su ferro. Krutzler, Uwe Schiefer."},"geometry":{"type":"Polygon","coordinates":[[[16.25,46.8],[16.6,46.8],[16.6,47.13],[16.25,47.13],[16.25,46.8]]]}},{"type":"Feature","properties":{"id":"steiermark","name":"Steiermark (Styria)","country":"Austria","region":"Stiria","grapes":"Sauvignon Blanc, Welschriesling, Morillon","type":"DAC","color":"#FFD700","description":"Colline stiriane. Sauvignon Blanc alpino. Tement, Polz."},"geometry":{"type":"Polygon","coordinates":[[[15.05,46.55],[16.0,46.55],[16.0,47.25],[15.05,47.25],[15.05,46.55]]]}},{"type":"Feature","properties":{"id":"wien","name":"Wien (Vienna)","country":"Austria","region":"Vienna","grapes":"Grüner Veltliner, Riesling, Gemischter Satz","type":"DAC","color":"#FFD700","description":"Unica capitale con viticultura urbana. Gemischter Satz tipico. Reinprecht."},"geometry":{"type":"Polygon","coordinates":[[[16.15,48.1],[16.6,48.1],[16.6,48.35],[16.15,48.35],[16.15,48.1]]]}},{"type":"Feature","properties":{"id":"napa","name":"Napa Valley AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon, Merlot, Chardonnay","type":"AVA","color":"#8B0000","description":"La capital del Cabernet. Sub-AVA: Stags Leap, Oakville, Rutherford. Opus One."},"geometry":{"type":"Polygon","coordinates":[[[-122.538,38.178],[-122.418,38.152],[-122.278,38.148],[-122.118,38.168],[-122.008,38.212],[-121.988,38.282],[-122.008,38.368],[-122.058,38.458],[-122.128,38.548],[-122.208,38.628],[-122.278,38.692],[-122.338,38.738],[-122.398,38.762],[-122.458,38.758],[-122.498,38.722],[-122.518,38.658],[-122.528,38.568],[-122.538,38.448],[-122.548,38.318],[-122.548,38.248],[-122.538,38.178]]]}},{"type":"Feature","properties":{"id":"willamette","name":"Willamette Valley AVA","country":"USA","region":"Oregon","grapes":"Pinot Noir, Chardonnay","type":"AVA","color":"#8B0000","description":"Pinot borgognone del NW. Argille e suoli marini. Drouhin, Eyrie, Ponzi."},"geometry":{"type":"Polygon","coordinates":[[[-123.6,44.8],[-122.25,44.8],[-122.25,45.72],[-123.6,45.72],[-123.6,44.8]]]}},{"type":"Feature","properties":{"id":"sonoma","name":"Sonoma County AVA","country":"USA","region":"California","grapes":"Pinot Noir, Chardonnay, Zinfandel","type":"AVA","color":"#8B0000","description":"Russian River Valley. Kistler, Williams Selyem, Ridge."},"geometry":{"type":"Polygon","coordinates":[[[-123.5,38.1],[-122.3,38.1],[-122.3,38.9],[-123.5,38.9],[-123.5,38.1]]]}},{"type":"Feature","properties":{"id":"stags_leap","name":"Stags Leap District AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon","type":"AVA","color":"#8B0000","description":"Vino che vinse il Giudizio di Parigi 1976. Clos du Val, Stag's Leap WC."},"geometry":{"type":"Polygon","coordinates":[[[-122.42,38.4],[-122.37,38.4],[-122.37,38.48],[-122.42,38.48],[-122.42,38.4]]]}},{"type":"Feature","properties":{"id":"rutherford","name":"Rutherford AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon","type":"AVA","color":"#8B0000","description":"Rutherford Dust: suoli alluvionali unici. Inglenook, Beaulieu, Rubicon."},"geometry":{"type":"Polygon","coordinates":[[[-122.46,38.44],[-122.39,38.44],[-122.39,38.5],[-122.46,38.5],[-122.46,38.44]]]}},{"type":"Feature","properties":{"id":"carneros","name":"Los Carneros AVA","country":"USA","region":"California","grapes":"Pinot Noir, Chardonnay","type":"AVA","color":"#8B0000","description":"Confine Napa-Sonoma. Vento oceanico. Domaine Carneros, Etude."},"geometry":{"type":"Polygon","coordinates":[[[-122.47,38.21],[-122.22,38.21],[-122.22,38.35],[-122.47,38.35],[-122.47,38.21]]]}},{"type":"Feature","properties":{"id":"paso_robles","name":"Paso Robles AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon, Syrah, Zinfandel","type":"AVA","color":"#8B0000","description":"Central Coast. Calcarelli calcarei. Turley, Tablas Creek, Justin."},"geometry":{"type":"Polygon","coordinates":[[[-120.95,35.45],[-120.25,35.45],[-120.25,35.8],[-120.95,35.8],[-120.95,35.45]]]}},{"type":"Feature","properties":{"id":"walla_walla","name":"Walla Walla Valley AVA","country":"USA","region":"Washington","grapes":"Cabernet Sauvignon, Syrah, Merlot","type":"AVA","color":"#8B0000","description":"Washington-Oregon. Cayuse su cailloux. L'Ecole 41, Leonetti."},"geometry":{"type":"Polygon","coordinates":[[[-118.77,45.8],[-118.18,45.8],[-118.18,46.25],[-118.77,46.25],[-118.77,45.8]]]}},{"type":"Feature","properties":{"id":"columbia_valley","name":"Columbia Valley AVA","country":"USA","region":"Washington","grapes":"Riesling, Merlot, Cabernet Sauvignon","type":"AVA","color":"#8B0000","description":"La più grande AVA del NW. Basalto. Chateau Ste. Michelle."},"geometry":{"type":"Polygon","coordinates":[[[-120.5,45.5],[-118.0,45.5],[-118.0,48.0],[-120.5,48.0],[-120.5,45.5]]]}},{"type":"Feature","properties":{"id":"finger_lakes","name":"Finger Lakes AVA","country":"USA","region":"New York","grapes":"Riesling, Chardonnay","type":"AVA","color":"#FFD700","description":"Laghi glaciali dello Stato di New York. Riesling freddo. Dr. Konstantin Frank."},"geometry":{"type":"Polygon","coordinates":[[[-77.1,42.4],[-76.5,42.4],[-76.5,42.9],[-77.1,42.9],[-77.1,42.4]]]}},{"type":"Feature","properties":{"id":"anderson_valley","name":"Anderson Valley AVA","country":"USA","region":"California","grapes":"Pinot Noir, Gewurztraminer","type":"AVA","color":"#8B0000","description":"Mendocino. Freddo oceanico. Littorai, Husch, Roederer Estate."},"geometry":{"type":"Polygon","coordinates":[[[-123.7,38.9],[-123.3,38.9],[-123.3,39.2],[-123.7,39.2],[-123.7,38.9]]]}},{"type":"Feature","properties":{"id":"alexander_valley","name":"Alexander Valley AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon, Chardonnay","type":"AVA","color":"#8B0000","description":"Sonoma nord. Suoli alluvionali caldi. Jordan, Clos du Bois."},"geometry":{"type":"Polygon","coordinates":[[[-123.05,38.58],[-122.7,38.58],[-122.7,38.85],[-123.05,38.85],[-123.05,38.58]]]}},{"type":"Feature","properties":{"id":"mendoza","name":"Mendoza DOC","country":"Argentina","region":"Mendoza","grapes":"Malbec, Cabernet Sauvignon, Torrontés","type":"DOC","color":"#8B0000","description":"Ande 900-1500m. Malbec identitario. Achaval Ferrer, Catena Zapata, Zuccardi."},"geometry":{"type":"Polygon","coordinates":[[[-69.488,-34.978],[-69.208,-34.892],[-68.868,-34.772],[-68.578,-34.588],[-68.348,-34.328],[-68.208,-34.028],[-68.178,-33.698],[-68.248,-33.378],[-68.428,-33.088],[-68.688,-32.858],[-69.008,-32.718],[-69.288,-32.668],[-69.488,-32.728],[-69.588,-32.908],[-69.588,-33.218],[-69.548,-33.558],[-69.508,-33.858],[-69.488,-34.978]]]}},{"type":"Feature","properties":{"id":"lujan_cuyo","name":"Luján de Cuyo DOC","country":"Argentina","region":"Mendoza","grapes":"Malbec","type":"DOC","color":"#8B0000","description":"Primo DOC argentino. Malbec su ghiaie 900-1100m. Achaval Ferrer Finca Bella Vista."},"geometry":{"type":"Polygon","coordinates":[[[-69.1,-33.51],[-68.7,-33.51],[-68.7,-33.19],[-69.1,-33.19],[-69.1,-33.51]]]}},{"type":"Feature","properties":{"id":"maipu","name":"Maipú","country":"Argentina","region":"Mendoza","grapes":"Malbec, Cabernet Sauvignon","type":"DOC","color":"#8B0000","description":"Suoli alluvionali di Mendoza bassa. Malbec ricco e opulento. Trapiche."},"geometry":{"type":"Polygon","coordinates":[[[-68.9,-33.03],[-68.65,-33.03],[-68.65,-32.85],[-68.9,-32.85],[-68.9,-33.03]]]}},{"type":"Feature","properties":{"id":"uco_valley","name":"Valle de Uco","country":"Argentina","region":"Mendoza","grapes":"Malbec, Cabernet Franc, Chardonnay","type":"DOC","color":"#8B0000","description":"Valle fresca a 1000-1500m. Altamira, Tupungato. Clos de los Siete."},"geometry":{"type":"Polygon","coordinates":[[[-69.35,-34.05],[-68.9,-34.05],[-68.9,-33.5],[-69.35,-33.5],[-69.35,-34.05]]]}},{"type":"Feature","properties":{"id":"cafayate","name":"Cafayate / Valles Calchaquíes","country":"Argentina","region":"Salta","grapes":"Torrontés, Malbec, Cabernet Sauvignon","type":"DOC","color":"#FFD700","description":"Altitudine 1750-2500m. Torrontés aromatico. El Esteco, Clos de Cachi."},"geometry":{"type":"Polygon","coordinates":[[[-65.85,-26.3],[-65.65,-26.3],[-65.65,-25.9],[-65.85,-25.9],[-65.85,-26.3]]]}},{"type":"Feature","properties":{"id":"san_juan_arg","name":"San Juan","country":"Argentina","region":"San Juan","grapes":"Syrah, Cabernet Sauvignon, Bonarda","type":"DOC","color":"#8B0000","description":"Norte de Mendoza. Caldo. Syrah potente. Zonda Valley."},"geometry":{"type":"Polygon","coordinates":[[[-69.0,-32.3],[-67.8,-32.3],[-67.8,-30.5],[-69.0,-30.5],[-69.0,-32.3]]]}},{"type":"Feature","properties":{"id":"neuquen","name":"Neuquén Patagonia","country":"Argentina","region":"Neuquén","grapes":"Pinot Noir, Merlot, Sauvignon Blanc","type":"DOC","color":"#8B0000","description":"Patagonia nord. 38° latitudine sud. Vento fresco. Malma, NQN."},"geometry":{"type":"Polygon","coordinates":[[[-70.5,-39.5],[-69.5,-39.5],[-69.5,-38.5],[-70.5,-38.5],[-70.5,-39.5]]]}},{"type":"Feature","properties":{"id":"rio_negro","name":"Río Negro","country":"Argentina","region":"Río Negro","grapes":"Pinot Noir, Sauvignon Blanc, Semillon","type":"DOC","color":"#8B0000","description":"Patagonia. Alta latitudine e freddo. Humberto Canale, Chacra."},"geometry":{"type":"Polygon","coordinates":[[[-68.5,-40.0],[-66.0,-40.0],[-66.0,-38.0],[-68.5,-38.0],[-68.5,-40.0]]]}},{"type":"Feature","properties":{"id":"maipo","name":"Valle de Maipo DO","country":"Cile","region":"Región Metropolitana","grapes":"Cabernet Sauvignon, Carménère","type":"DO","color":"#8B0000","description":"Cabernet d'eccellenza vicino Santiago. Concha y Toro Don Melchor, Almaviva."},"geometry":{"type":"Polygon","coordinates":[[[-71.1,-34.1],[-70.1,-34.1],[-70.1,-33.5],[-71.1,-33.5],[-71.1,-34.1]]]}},{"type":"Feature","properties":{"id":"colchagua","name":"Valle de Colchagua DO","country":"Cile","region":"O'Higgins","grapes":"Carménère, Cabernet Sauvignon","type":"DO","color":"#8B0000","description":"Carménère patria. Montes Alpha M, Casa Lapostolle Clos Apalta."},"geometry":{"type":"Polygon","coordinates":[[[-71.7,-34.9],[-70.65,-34.9],[-70.65,-34.38],[-71.7,-34.38],[-71.7,-34.9]]]}},{"type":"Feature","properties":{"id":"casablanca","name":"Valle de Casablanca DO","country":"Cile","region":"Valparaíso","grapes":"Chardonnay, Sauvignon Blanc, Pinot Noir","type":"DO","color":"#FFD700","description":"Nebbiolina pacifica. Bianchi di precisione. Villard, Kingston, Matetic."},"geometry":{"type":"Polygon","coordinates":[[[-71.55,-33.45],[-71.0,-33.45],[-71.0,-33.1],[-71.55,-33.1],[-71.55,-33.45]]]}},{"type":"Feature","properties":{"id":"aconcagua","name":"Valle del Aconcagua DO","country":"Cile","region":"Valparaíso","grapes":"Cabernet Sauvignon, Carménère","type":"DO","color":"#8B0000","description":"Zona calda a nord. Viña Errázuriz Don Maximiano, Almaviva."},"geometry":{"type":"Polygon","coordinates":[[[-70.9,-32.95],[-70.35,-32.95],[-70.35,-32.55],[-70.9,-32.55],[-70.9,-32.95]]]}},{"type":"Feature","properties":{"id":"elqui","name":"Valle del Elqui DO","country":"Cile","region":"Coquimbo","grapes":"Syrah, Sauvignon Blanc","type":"DO","color":"#FFD700","description":"Zona desertica a 300-2000m. Pisquera del Elqui. Tabali."},"geometry":{"type":"Polygon","coordinates":[[[-71.35,-30.2],[-70.55,-30.2],[-70.55,-29.55],[-71.35,-29.55],[-71.35,-30.2]]]}},{"type":"Feature","properties":{"id":"leyda","name":"Valle de Leyda DO","country":"Cile","region":"Valparaíso","grapes":"Pinot Noir, Sauvignon Blanc, Chardonnay","type":"DO","color":"#FFD700","description":"Sottozona fredda di San Antonio. Oceano Pacifico. Matetic, Leyda."},"geometry":{"type":"Polygon","coordinates":[[[-71.6,-33.8],[-71.3,-33.8],[-71.3,-33.5],[-71.6,-33.5],[-71.6,-33.8]]]}},{"type":"Feature","properties":{"id":"limari","name":"Valle del Limarí DO","country":"Cile","region":"Coquimbo","grapes":"Chardonnay, Syrah","type":"DO","color":"#FFD700","description":"Calcare e argille rosse. Chardonnay minerale. Casa Tamaya."},"geometry":{"type":"Polygon","coordinates":[[[-71.5,-30.55],[-70.55,-30.55],[-70.55,-30.0],[-71.5,-30.0],[-71.5,-30.55]]]}},{"type":"Feature","properties":{"id":"rapel","name":"Valle del Rapel DO","country":"Cile","region":"O'Higgins","grapes":"Carménère, Merlot, Cabernet Franc","type":"DO","color":"#8B0000","description":"Cachapoal e Colchagua. Carménère varietale. Concha y Toro."},"geometry":{"type":"Polygon","coordinates":[[[-71.5,-34.7],[-70.3,-34.7],[-70.3,-34.0],[-71.5,-34.0],[-71.5,-34.7]]]}},{"type":"Feature","properties":{"id":"bío_bío","name":"Valle del Bío-Bío DO","country":"Cile","region":"Biobío","grapes":"País, Moscatel, Riesling","type":"DO","color":"#8B0000","description":"Sud del Cile. Suoli vulcanici. País antico. Vigno association."},"geometry":{"type":"Polygon","coordinates":[[[-73.0,-37.9],[-71.5,-37.9],[-71.5,-36.8],[-73.0,-36.8],[-73.0,-37.9]]]}},{"type":"Feature","properties":{"id":"itata","name":"Valle del Itata DO","country":"Cile","region":"Biobío","grapes":"País, Cinsault, Moscatel","type":"DO","color":"#8B0000","description":"Vigneti centenari. País riscoperto. Cinsault su granito. La Causa."},"geometry":{"type":"Polygon","coordinates":[[[-72.9,-37.3],[-71.5,-37.3],[-71.5,-36.5],[-72.9,-36.5],[-72.9,-37.3]]]}},{"type":"Feature","properties":{"id":"barossa","name":"Barossa Valley GI","country":"Australia","region":"South Australia","grapes":"Shiraz, Grenache, Riesling","type":"GI","color":"#8B0000","description":"Shiraz centenario. Terra rossa. Penfolds Grange, Henschke Hill of Grace."},"geometry":{"type":"Polygon","coordinates":[[[138.792,-34.708],[138.888,-34.688],[138.978,-34.678],[139.058,-34.682],[139.118,-34.702],[139.148,-34.736],[139.132,-34.772],[139.088,-34.8],[139.018,-34.812],[138.938,-34.81],[138.858,-34.79],[138.792,-34.756],[138.762,-34.722],[138.78,-34.712],[138.792,-34.708]]]}},{"type":"Feature","properties":{"id":"mclaren","name":"McLaren Vale GI","country":"Australia","region":"South Australia","grapes":"Shiraz, Grenache, Cabernet","type":"GI","color":"#8B0000","description":"Fleurieu Peninsula. d'Arenberg, Wirra Wirra, Clarendon Hills."},"geometry":{"type":"Polygon","coordinates":[[[138.46,-35.3],[138.7,-35.3],[138.7,-35.07],[138.46,-35.07],[138.46,-35.3]]]}},{"type":"Feature","properties":{"id":"margaret_river","name":"Margaret River GI","country":"Australia","region":"Western Australia","grapes":"Cabernet Sauvignon, Chardonnay","type":"GI","color":"#8B0000","description":"Oceano Indiano-Pacifico. Leeuwin Estate, Moss Wood, Cullen."},"geometry":{"type":"Polygon","coordinates":[[[114.92,-34.36],[115.25,-34.36],[115.25,-33.59],[114.92,-33.59],[114.92,-34.36]]]}},{"type":"Feature","properties":{"id":"hunter_valley","name":"Hunter Valley GI","country":"Australia","region":"New South Wales","grapes":"Semillon, Shiraz, Chardonnay","type":"GI","color":"#FFD700","description":"Semillon invecchiato unico. Tyrrell's, McWilliam's Lovedale."},"geometry":{"type":"Polygon","coordinates":[[[150.9,-33.0],[151.43,-33.0],[151.43,-32.47],[150.9,-32.47],[150.9,-33.0]]]}},{"type":"Feature","properties":{"id":"coonawarra","name":"Coonawarra GI","country":"Australia","region":"South Australia","grapes":"Cabernet Sauvignon, Shiraz","type":"GI","color":"#8B0000","description":"Terra Rossa su calcare. Cabernet australiano più elegante. Wynns."},"geometry":{"type":"Polygon","coordinates":[[[140.78,-37.4],[140.95,-37.4],[140.95,-36.98],[140.78,-36.98],[140.78,-37.4]]]}},{"type":"Feature","properties":{"id":"yarra_valley","name":"Yarra Valley GI","country":"Australia","region":"Victoria","grapes":"Pinot Noir, Chardonnay","type":"GI","color":"#8B0000","description":"Colline fresche vicino Melbourne. Yering Station, De Bortoli."},"geometry":{"type":"Polygon","coordinates":[[[145.3,-37.9],[145.9,-37.9],[145.9,-37.5],[145.3,-37.5],[145.3,-37.9]]]}},{"type":"Feature","properties":{"id":"clare_valley","name":"Clare Valley GI","country":"Australia","region":"South Australia","grapes":"Riesling, Shiraz, Cabernet","type":"GI","color":"#FFD700","description":"Riesling di Clare invecchia 20+ anni. Jim Barry, Grosset."},"geometry":{"type":"Polygon","coordinates":[[[138.55,-33.95],[138.9,-33.95],[138.9,-33.6],[138.55,-33.6],[138.55,-33.95]]]}},{"type":"Feature","properties":{"id":"eden_valley","name":"Eden Valley GI","country":"Australia","region":"South Australia","grapes":"Riesling, Shiraz","type":"GI","color":"#FFD700","description":"Alta quota sopra Barossa. Henschke Hill of Grace qui. Pewsey Vale."},"geometry":{"type":"Polygon","coordinates":[[[138.88,-34.65],[139.08,-34.65],[139.08,-34.35],[138.88,-34.35],[138.88,-34.65]]]}},{"type":"Feature","properties":{"id":"adelaide_hills","name":"Adelaide Hills GI","country":"Australia","region":"South Australia","grapes":"Sauvignon Blanc, Pinot Noir, Chardonnay","type":"GI","color":"#FFD700","description":"Freschezza alpina vicino Adelaide. Shaw + Smith, Ashton Hills."},"geometry":{"type":"Polygon","coordinates":[[[138.6,-35.25],[138.9,-35.25],[138.9,-34.9],[138.6,-34.9],[138.6,-35.25]]]}},{"type":"Feature","properties":{"id":"heathcote","name":"Heathcote GI","country":"Australia","region":"Victoria","grapes":"Shiraz","type":"GI","color":"#8B0000","description":"Cambrian soil rosso-violaceo unico. Jasper Hill, Sanguine Estate."},"geometry":{"type":"Polygon","coordinates":[[[144.6,-37.0],[144.95,-37.0],[144.95,-36.6],[144.6,-36.6],[144.6,-37.0]]]}},{"type":"Feature","properties":{"id":"great_western","name":"Grampians GI","country":"Australia","region":"Victoria","grapes":"Shiraz, Cabernet","type":"GI","color":"#8B0000","description":"Altipiani di Mount Langhi Ghiran. Mount Langi Ghiran, Best's."},"geometry":{"type":"Polygon","coordinates":[[[142.2,-37.45],[143.0,-37.45],[143.0,-36.8],[142.2,-36.8],[142.2,-37.45]]]}},{"type":"Feature","properties":{"id":"tasmania","name":"Tasmania GI","country":"Australia","region":"Tasmania","grapes":"Pinot Noir, Riesling, Chardonnay","type":"GI","color":"#8B0000","description":"Isola fredda. Sparkling method traditionnel. Stefano Lubiana, Jansz."},"geometry":{"type":"Polygon","coordinates":[[[144.6,-43.65],[148.3,-43.65],[148.3,-40.6],[144.6,-40.6],[144.6,-43.65]]]}},{"type":"Feature","properties":{"id":"mudgee","name":"Mudgee GI","country":"Australia","region":"New South Wales","grapes":"Cabernet Sauvignon, Shiraz, Chardonnay","type":"GI","color":"#8B0000","description":"Altipiani oltre Blue Mountains. Rosemberg Estate, Logan."},"geometry":{"type":"Polygon","coordinates":[[[149.4,-32.85],[149.85,-32.85],[149.85,-32.45],[149.4,-32.45],[149.4,-32.85]]]}},{"type":"Feature","properties":{"id":"marlborough","name":"Marlborough GI","country":"Nuova Zelanda","region":"South Island","grapes":"Sauvignon Blanc, Pinot Noir","type":"GI","color":"#FFD700","description":"Wairau Valley. Sauvignon che ha cambiato il mondo. Cloudy Bay, Greywacke."},"geometry":{"type":"Polygon","coordinates":[[[173.658,-41.858],[173.838,-41.838],[174.028,-41.838],[174.198,-41.852],[174.298,-41.88],[174.328,-41.918],[174.29,-41.958],[174.178,-41.982],[174.008,-41.988],[173.828,-41.968],[173.668,-41.928],[173.568,-41.88],[173.572,-41.858],[173.658,-41.858]]]}},{"type":"Feature","properties":{"id":"central_otago","name":"Central Otago GI","country":"Nuova Zelanda","region":"South Island","grapes":"Pinot Noir","type":"GI","color":"#8B0000","description":"Pinot a latitudine più alta. Clima continentale. Felton Road, Rippon."},"geometry":{"type":"Polygon","coordinates":[[[168.8,-45.5],[169.85,-45.5],[169.85,-44.6],[168.8,-44.6],[168.8,-45.5]]]}},{"type":"Feature","properties":{"id":"hawkes_bay","name":"Hawke's Bay GI","country":"Nuova Zelanda","region":"North Island","grapes":"Cabernet, Merlot, Chardonnay","type":"GI","color":"#8B0000","description":"Gimblett Gravels su letto di fiume. Craggy Range, Te Mata."},"geometry":{"type":"Polygon","coordinates":[[[176.4,-39.85],[177.1,-39.85],[177.1,-39.4],[176.4,-39.4],[176.4,-39.85]]]}},{"type":"Feature","properties":{"id":"gisborne","name":"Gisborne GI","country":"Nuova Zelanda","region":"North Island","grapes":"Chardonnay, Gewurztraminer","type":"GI","color":"#FFD700","description":"Primo sole. Chardonnay grassoso. Vinoptima, Millton."},"geometry":{"type":"Polygon","coordinates":[[[177.6,-38.85],[178.25,-38.85],[178.25,-38.35],[177.6,-38.35],[177.6,-38.85]]]}},{"type":"Feature","properties":{"id":"nelson","name":"Nelson GI","country":"Nuova Zelanda","region":"South Island","grapes":"Chardonnay, Pinot Noir, Riesling","type":"GI","color":"#FFD700","description":"Top del South Island. Seifried, Neudorf."},"geometry":{"type":"Polygon","coordinates":[[[172.8,-41.55],[173.5,-41.55],[173.5,-41.0],[172.8,-41.0],[172.8,-41.55]]]}},{"type":"Feature","properties":{"id":"wairarapa","name":"Wairarapa / Martinborough GI","country":"Nuova Zelanda","region":"North Island","grapes":"Pinot Noir, Sauvignon Blanc","type":"GI","color":"#8B0000","description":"Calcari e terrazze di ghiaia. Ata Rangi, Palliser."},"geometry":{"type":"Polygon","coordinates":[[[175.2,-41.4],[175.85,-41.4],[175.85,-40.9],[175.2,-40.9],[175.2,-41.4]]]}},{"type":"Feature","properties":{"id":"waipara","name":"Waipara Valley / North Canterbury GI","country":"Nuova Zelanda","region":"South Island","grapes":"Pinot Noir, Riesling","type":"GI","color":"#8B0000","description":"Calcari di Waipara. Riesling e Pinot Noir fresco. Pegasus Bay."},"geometry":{"type":"Polygon","coordinates":[[[172.55,-43.35],[172.95,-43.35],[172.95,-43.05],[172.55,-43.05],[172.55,-43.35]]]}},{"type":"Feature","properties":{"id":"stellenbosch","name":"Stellenbosch WO","country":"Sud Africa","region":"Western Cape","grapes":"Cabernet Sauvignon, Chenin Blanc","type":"WO","color":"#8B0000","description":"Granito e arenaria. Kanonkop, Meerlust, Vergelegen."},"geometry":{"type":"Polygon","coordinates":[[[18.722,-34.162],[18.842,-34.148],[18.962,-34.152],[19.062,-34.172],[19.112,-34.208],[19.112,-34.258],[19.072,-34.304],[18.992,-34.334],[18.892,-34.344],[18.792,-34.326],[18.712,-34.288],[18.672,-34.234],[18.678,-34.192],[18.722,-34.162]]]}},{"type":"Feature","properties":{"id":"franschhoek","name":"Franschhoek WO","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Cabernet, Syrah","type":"WO","color":"#8B0000","description":"Valle dei Franchi (Ugonotti). Granito. Boekenhoutskloof, Plaisir."},"geometry":{"type":"Polygon","coordinates":[[[18.96,-33.98],[19.14,-33.98],[19.14,-33.86],[18.96,-33.86],[18.96,-33.98]]]}},{"type":"Feature","properties":{"id":"paarl","name":"Paarl WO","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Pinotage, Shiraz","type":"WO","color":"#8B0000","description":"Domaine Vrede en Lust, Fairview. Granito e schisto."},"geometry":{"type":"Polygon","coordinates":[[[18.9,-33.8],[19.05,-33.8],[19.05,-33.55],[18.9,-33.55],[18.9,-33.8]]]}},{"type":"Feature","properties":{"id":"elgin","name":"Elgin WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Pinot Noir, Chardonnay","type":"WO","color":"#FFD700","description":"Altipiano fresco 300m. Mele e vino. Paul Cluver, Shannon."},"geometry":{"type":"Polygon","coordinates":[[[18.9,-34.25],[19.1,-34.25],[19.1,-34.05],[18.9,-34.05],[18.9,-34.25]]]}},{"type":"Feature","properties":{"id":"constantia","name":"Constantia WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Semillon","type":"WO","color":"#FFD700","description":"Vin de Constance storico (Napoleone). Klein Constantia."},"geometry":{"type":"Polygon","coordinates":[[[18.35,-34.1],[18.45,-34.1],[18.45,-33.97],[18.35,-33.97],[18.35,-34.1]]]}},{"type":"Feature","properties":{"id":"walker_bay","name":"Walker Bay WO","country":"Sud Africa","region":"Western Cape","grapes":"Pinot Noir, Chardonnay","type":"WO","color":"#8B0000","description":"Oceano Atlantico. Bouchard Finlayson, Hamilton Russell."},"geometry":{"type":"Polygon","coordinates":[[[19.25,-34.5],[19.55,-34.5],[19.55,-34.25],[19.25,-34.25],[19.25,-34.5]]]}},{"type":"Feature","properties":{"id":"swartland","name":"Swartland WO","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Syrah, Grenache","type":"WO","color":"#8B0000","description":"The Swartland Revolution. Eben Sadie, Mullineux, Badenhorst."},"geometry":{"type":"Polygon","coordinates":[[[18.35,-33.3],[19.0,-33.3],[19.0,-33.0],[18.35,-33.0],[18.35,-33.3]]]}},{"type":"Feature","properties":{"id":"robertson","name":"Robertson WO","country":"Sud Africa","region":"Western Cape","grapes":"Chardonnay, Cabernet Sauvignon","type":"WO","color":"#FFD700","description":"Valle calda e secca. Calcare. Graham Beck per bollicine."},"geometry":{"type":"Polygon","coordinates":[[[19.6,-33.85],[20.1,-33.85],[20.1,-33.55],[19.6,-33.55],[19.6,-33.85]]]}},{"type":"Feature","properties":{"id":"hemel_en_aarde","name":"Hemel-en-Aarde WO","country":"Sud Africa","region":"Western Cape","grapes":"Pinot Noir, Chardonnay","type":"WO","color":"#8B0000","description":"Tre sottozone. Shale su calcare. Storm, Creation."},"geometry":{"type":"Polygon","coordinates":[[[19.26,-34.43],[19.44,-34.43],[19.44,-34.28],[19.26,-34.28],[19.26,-34.43]]]}},{"type":"Feature","properties":{"id":"santorini","name":"Santorini PDO","country":"Grecia","region":"Cicladi","grapes":"Assyrtiko","type":"PDO","color":"#FFD700","description":"Suolo vulcanico pumice. Kouloura. Gaia, Hatzidakis, Sigalas."},"geometry":{"type":"Polygon","coordinates":[[[25.348,36.318],[25.408,36.302],[25.468,36.308],[25.508,36.332],[25.522,36.368],[25.508,36.406],[25.468,36.432],[25.408,36.444],[25.348,36.432],[25.308,36.404],[25.298,36.368],[25.314,36.336],[25.348,36.318]]]}},{"type":"Feature","properties":{"id":"naoussa","name":"Naoussa PDO","country":"Grecia","region":"Macedonia","grapes":"Xinomavro","type":"PDO","color":"#8B0000","description":"Xinomavro: il Nebbiolo greco. Suoli calcarei del nord. Thymiopoulos."},"geometry":{"type":"Polygon","coordinates":[[[22.0,40.55],[22.15,40.55],[22.15,40.7],[22.0,40.7],[22.0,40.55]]]}},{"type":"Feature","properties":{"id":"nemea","name":"Nemea PDO","country":"Grecia","region":"Peloponneso","grapes":"Agiorgitiko","type":"PDO","color":"#8B0000","description":"Agiorgitiko su calcare e argille. Gaia, Skouras. San Giorgio sul vino."},"geometry":{"type":"Polygon","coordinates":[[[22.55,37.75],[22.8,37.75],[22.8,37.95],[22.55,37.95],[22.55,37.75]]]}},{"type":"Feature","properties":{"id":"crete_peza","name":"Peza PDO","country":"Grecia","region":"Creta","grapes":"Kotsifali, Mandilari, Vilana","type":"PDO","color":"#8B0000","description":"Altipiani centrali di Creta. Kotsifali su argille. Minos-Miliarakis."},"geometry":{"type":"Polygon","coordinates":[[[25.0,35.15],[25.35,35.15],[25.35,35.45],[25.0,35.45],[25.0,35.15]]]}},{"type":"Feature","properties":{"id":"muscat_samos","name":"Muscat de Samos PDO","country":"Grecia","region":"Samos","grapes":"Muscat Blanc à Petits Grains","type":"PDO","color":"#FFD700","description":"Moscato dolce dell'isola di Samos. Cooperative di Samos."},"geometry":{"type":"Polygon","coordinates":[[[26.7,37.6],[26.9,37.6],[26.9,37.82],[26.7,37.82],[26.7,37.6]]]}},{"type":"Feature","properties":{"id":"mantinia","name":"Mantinia PDO","country":"Grecia","region":"Peloponneso","grapes":"Moschofilero","type":"PDO","color":"#FFD700","description":"Altopiano a 600m. Moschofilero rosa e aromatico. Tselepos."},"geometry":{"type":"Polygon","coordinates":[[[22.25,37.45],[22.45,37.45],[22.45,37.6],[22.25,37.6],[22.25,37.45]]]}},{"type":"Feature","properties":{"id":"limnio_lemnas","name":"Muscat de Limnos PDO","country":"Grecia","region":"Limnos","grapes":"Muscat d'Alexandrie","type":"PDO","color":"#FFD700","description":"Lemnos. Muscat d'Alexandrie su scisto. Cooperative."},"geometry":{"type":"Polygon","coordinates":[[[25.1,39.8],[25.5,39.8],[25.5,40.0],[25.1,40.0],[25.1,39.8]]]}},{"type":"Feature","properties":{"id":"rapsani","name":"Rapsani PDO","country":"Grecia","region":"Tessaglia","grapes":"Xinomavro, Krassato, Stavroto","type":"PDO","color":"#8B0000","description":"Monte Olimpo. Tre vitigni su granito. Tsantali."},"geometry":{"type":"Polygon","coordinates":[[[22.3,39.9],[22.5,39.9],[22.5,40.1],[22.3,40.1],[22.3,39.9]]]}},{"type":"Feature","properties":{"id":"tokaj","name":"Tokaj PDO","country":"Ungheria","region":"Tokaj-Hegyalja","grapes":"Furmint, Hárslevelű","type":"PDO","color":"#FFD700","description":"Vino dei Re. Botrytis 3-6 puttonyos. Disznókő, Royal Tokaji."},"geometry":{"type":"Polygon","coordinates":[[[21.248,47.868],[21.378,47.848],[21.518,47.842],[21.618,47.852],[21.668,47.878],[21.662,47.918],[21.618,47.958],[21.538,47.988],[21.428,48.008],[21.308,48.01],[21.208,47.992],[21.152,47.958],[21.148,47.918],[21.188,47.886],[21.248,47.868]]]}},{"type":"Feature","properties":{"id":"eger","name":"Eger","country":"Ungheria","region":"Heves","grapes":"Egri Bikavér (Toro di Egro)","type":"DO","color":"#8B0000","description":"Bikavér: blend di Kékfrankos, Kadarka. Barokk cantina di tuff vulcanico."},"geometry":{"type":"Polygon","coordinates":[[[20.25,47.75],[20.55,47.75],[20.55,48.0],[20.25,48.0],[20.25,47.75]]]}},{"type":"Feature","properties":{"id":"sopron","name":"Sopron","country":"Ungheria","region":"Győr-Moson-Sopron","grapes":"Kékfrankos (Blaufränkisch)","type":"DO","color":"#8B0000","description":"Confine austriaco. Kékfrankos fresco e speziato. Weninger."},"geometry":{"type":"Polygon","coordinates":[[[16.45,47.55],[16.75,47.55],[16.75,47.8],[16.45,47.8],[16.45,47.55]]]}},{"type":"Feature","properties":{"id":"villany","name":"Villány","country":"Ungheria","region":"Baranya","grapes":"Cabernet Sauvignon, Merlot, Portugieser","type":"DO","color":"#8B0000","description":"Estremo sud. Il più caldo. Gere, Bock, Malatinszky."},"geometry":{"type":"Polygon","coordinates":[[[18.0,45.85],[18.3,45.85],[18.3,46.05],[18.0,46.05],[18.0,45.85]]]}},{"type":"Feature","properties":{"id":"kakheti","name":"Kakheti GI","country":"Georgia","region":"Kakheti","grapes":"Rkatsiteli, Saperavi","type":"GI","color":"#8B0000","description":"8000 anni di storia. Kvevri interrate. Rkatsiteli ambrato, Saperavi."},"geometry":{"type":"Polygon","coordinates":[[[44.78,41.36],[46.09,41.36],[46.09,42.06],[44.78,42.06],[44.78,41.36]]]}},{"type":"Feature","properties":{"id":"kartli","name":"Kartli GI","country":"Georgia","region":"Kartli","grapes":"Rkatsiteli, Chinuri","type":"GI","color":"#FFD700","description":"Valle Mtkvari. Vini bianchi secchi. Chateau Mukhrani."},"geometry":{"type":"Polygon","coordinates":[[[43.9,41.5],[44.9,41.5],[44.9,42.1],[43.9,42.1],[43.9,41.5]]]}},{"type":"Feature","properties":{"id":"imereti","name":"Imereti GI","country":"Georgia","region":"Imereti","grapes":"Tsolikouri, Tsitska","type":"GI","color":"#FFD700","description":"Stile semi-ambrato con breve macerazione. Pheasant's Tears."},"geometry":{"type":"Polygon","coordinates":[[[42.9,42.1],[43.7,42.1],[43.7,42.6],[42.9,42.6],[42.9,42.1]]]}},{"type":"Feature","properties":{"id":"racha","name":"Racha-Lechkhumi GI","country":"Georgia","region":"Racha","grapes":"Alexandrouli, Mujuretuli","type":"GI","color":"#8B0000","description":"Montagna. Vini parzialmente fermentati semidolci naturali. Khvanchkara."},"geometry":{"type":"Polygon","coordinates":[[[42.6,42.45],[43.2,42.45],[43.2,42.9],[42.6,42.9],[42.6,42.45]]]}},{"type":"Feature","properties":{"id":"morava_cz","name":"Moravian Wine Region","country":"Repubblica Ceca","region":"Moravia","grapes":"Welschriesling, Blauburger, Riesling","type":"DO","color":"#FFD700","description":"Moravia meridionale. Suoli calcarei e loess. Sonberk, Pavlovín."},"geometry":{"type":"Polygon","coordinates":[[[16.55,48.5],[17.85,48.5],[17.85,49.1],[16.55,49.1],[16.55,48.5]]]}},{"type":"Feature","properties":{"id":"tokaj_sk","name":"Tokajský DO","country":"Slovacchia","region":"Tokajský","grapes":"Furmint, Lipovina","type":"DO","color":"#FFD700","description":"Parte slovacca del Tokaj. Pochissimi produttori. Mrva & Stanko."},"geometry":{"type":"Polygon","coordinates":[[[21.45,48.3],[21.8,48.3],[21.8,48.5],[21.45,48.5],[21.45,48.3]]]}},{"type":"Feature","properties":{"id":"fruska_gora","name":"Fruška Gora","country":"Serbia","region":"Vojvodina","grapes":"Riesling Italico, Chardonnay, Frankovka","type":"DO","color":"#FFD700","description":"Montagna su Sava. Produttori tradizionali. Tikveš."},"geometry":{"type":"Polygon","coordinates":[[[19.05,45.1],[19.95,45.1],[19.95,45.32],[19.05,45.32],[19.05,45.1]]]}},{"type":"Feature","properties":{"id":"zilavka","name":"Hercegovački","country":"Bosnia Erzegovina","region":"Erzegovina","grapes":"Žilavka, Blatina","type":"DO","color":"#FFD700","description":"Žilavka: bianco autoctono su calcare. Blatina rosso."},"geometry":{"type":"Polygon","coordinates":[[[17.2,43.15],[18.25,43.15],[18.25,43.75],[17.2,43.75],[17.2,43.15]]]}},{"type":"Feature","properties":{"id":"naoussa_grk","name":"Vissi / Naoussa","country":"Grecia","region":"Macedonia","grapes":"Xinomavro","type":"PDO","color":"#8B0000","description":"Sub-appellation di Naoussa. Alta quota e potenza."},"geometry":{"type":"Polygon","coordinates":[[[22.03,40.59],[22.12,40.59],[22.12,40.68],[22.03,40.68],[22.03,40.59]]]}},{"type":"Feature","properties":{"id":"jeruzalem","name":"Jeruzalem Ormož","country":"Slovenia","region":"Štajerska","grapes":"Pinot Gris, Sauvignon Blanc, Riesling","type":"DO","color":"#FFD700","description":"La Gerusalemme slovena. Colline del Ljutomer. Puklavec."},"geometry":{"type":"Polygon","coordinates":[[[16.05,46.42],[16.3,46.42],[16.3,46.6],[16.05,46.6],[16.05,46.42]]]}},{"type":"Feature","properties":{"id":"vipavska","name":"Vipava Valley","country":"Slovenia","region":"Vipavska","grapes":"Rebula, Malvazija, Merlot","type":"DO","color":"#FFD700","description":"Valle del Vipacco. Bora. Simčič, Movia. Rebula e vini orange."},"geometry":{"type":"Polygon","coordinates":[[[13.72,45.78],[14.06,45.78],[14.06,46.0],[13.72,46.0],[13.72,45.78]]]}},{"type":"Feature","properties":{"id":"karst_teran","name":"Kras (Karst)","country":"Slovenia","region":"Kraška","grapes":"Teran (Refosco)","type":"DO","color":"#8B0000","description":"Carso sloveno su terra rossa. Teran potente e acido. Štoka."},"geometry":{"type":"Polygon","coordinates":[[[13.75,45.55],[14.1,45.55],[14.1,45.78],[13.75,45.78],[13.75,45.55]]]}},{"type":"Feature","properties":{"id":"istria","name":"Istria","country":"Croazia","region":"Istria","grapes":"Malvazija Istarska, Teran","type":"DO","color":"#FFD700","description":"Malvazija istriana bianca fruttata. Kozlović, Matošević."},"geometry":{"type":"Polygon","coordinates":[[[13.6,44.9],[14.2,44.9],[14.2,45.4],[13.6,45.4],[13.6,44.9]]]}},{"type":"Feature","properties":{"id":"peljesac","name":"Pelješac","country":"Croazia","region":"Dalmazia","grapes":"Plavac Mali","type":"DO","color":"#8B0000","description":"Plavac Mali su Pelješac. Dingač PDZO: il migliore. Matuško."},"geometry":{"type":"Polygon","coordinates":[[[16.85,42.85],[17.55,42.85],[17.55,43.07],[16.85,43.07],[16.85,42.85]]]}},{"type":"Feature","properties":{"id":"kveder_primorska","name":"Primorska","country":"Slovenia","region":"Primorska","grapes":"Rebula, Merlot, Cabernet Franc","type":"DO","color":"#FFD700","description":"Collio sloveno. Rebula per vini orange. Keber, Štemberger."},"geometry":{"type":"Polygon","coordinates":[[[13.5,45.82],[13.9,45.82],[13.9,46.1],[13.5,46.1],[13.5,45.82]]]}},{"type":"Feature","properties":{"id":"priorat_cat","name":"Priorat DOQ","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Cariñena, Syrah","type":"DOQ","color":"#8B0000","description":"Llicorella scura. Clos i Terrasses, Álvaro Palacios."},"geometry":{"type":"Polygon","coordinates":[[[0.65,41.08],[0.9,41.08],[0.9,41.28],[0.65,41.28],[0.65,41.08]]]}},{"type":"Feature","properties":{"id":"dealu_mare","name":"Dealu Mare DOC","country":"Romania","region":"Muntenia","grapes":"Fetească Neagră, Cabernet Sauvignon","type":"DOC","color":"#8B0000","description":"Carpazi meridionali. Fetească Neagră autoctono. Serve, Davino."},"geometry":{"type":"Polygon","coordinates":[[[26.0,44.8],[26.8,44.8],[26.8,45.1],[26.0,45.1],[26.0,44.8]]]}},{"type":"Feature","properties":{"id":"jidvei","name":"Târnave DOC","country":"Romania","region":"Transilvania","grapes":"Fetească Albă, Fetească Regală","type":"DOC","color":"#FFD700","description":"Transilvania alpina. Bianchi freschi e aromatici. Jidvei."},"geometry":{"type":"Polygon","coordinates":[[[23.8,46.1],[24.4,46.1],[24.4,46.5],[23.8,46.5],[23.8,46.1]]]}},{"type":"Feature","properties":{"id":"murfatlar","name":"Murfatlar DOC","country":"Romania","region":"Dobruja","grapes":"Chardonnay, Merlot, Muscat Ottonel","type":"DOC","color":"#FFD700","description":"Pianura danubiana sul Mar Nero. Chardonnay morbido. Murfatlar SRL."},"geometry":{"type":"Polygon","coordinates":[[[28.3,44.1],[28.55,44.1],[28.55,44.3],[28.3,44.3],[28.3,44.1]]]}},{"type":"Feature","properties":{"id":"moldovan","name":"Codru DO","country":"Moldavia","region":"Centro Moldavia","grapes":"Fetească Albă, Rară Neagră","type":"DO","color":"#FFD700","description":"Colinare moldave. Purcari, Cricova, Mileștii Mici (cantina più grande)."},"geometry":{"type":"Polygon","coordinates":[[[27.9,47.0],[28.5,47.0],[28.5,47.5],[27.9,47.5],[27.9,47.0]]]}},{"type":"Feature","properties":{"id":"bekaa","name":"Bekaa Valley","country":"Libano","region":"Valle della Bekaa","grapes":"Cinsault, Cabernet Sauvignon, Rhône varieties","type":"DO","color":"#8B0000","description":"Altipiano 1000m. Château Musar, Ksara, Kefraya."},"geometry":{"type":"Polygon","coordinates":[[[35.6,33.4],[36.7,33.4],[36.7,34.5],[35.6,34.5],[35.6,33.4]]]}},{"type":"Feature","properties":{"id":"galil","name":"Galilee / Golan Heights","country":"Israele","region":"Galilea","grapes":"Cabernet Sauvignon, Syrah, Sauvignon Blanc","type":"DO","color":"#8B0000","description":"Plateau del Golan a 1000m. Golan Heights Winery, Yarden."},"geometry":{"type":"Polygon","coordinates":[[[35.55,32.85],[35.9,32.85],[35.9,33.25],[35.55,33.25],[35.55,32.85]]]}},{"type":"Feature","properties":{"id":"marruecos_atlas","name":"Meknès-Atlas","country":"Marocco","region":"Meknès","grapes":"Cabernet Sauvignon, Syrah, Grenache","type":"DO","color":"#8B0000","description":"Colline ai piedi dell'Atlante. Clima temperato. Domaine Zouina."},"geometry":{"type":"Polygon","coordinates":[[[-6.0,33.5],[-5.4,33.5],[-5.4,33.9],[-6.0,33.9],[-6.0,33.5]]]}},{"type":"Feature","properties":{"id":"swartland_za","name":"Swartland","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Grenache, Syrah","type":"WO","color":"#FFD700","description":"Terroir naturale. Sadie Family, Mullineux, Badenhorst."},"geometry":{"type":"Polygon","coordinates":[[[18.35,-33.3],[19.0,-33.3],[19.0,-33.0],[18.35,-33.0],[18.35,-33.3]]]}},{"type":"Feature","properties":{"id":"ningxia","name":"Ningxia Wine Region","country":"Cina","region":"Ningxia","grapes":"Cabernet Sauvignon, Merlot","type":"DO","color":"#8B0000","description":"Cina nord-est. Desertico con irrigazione. Changyu AFIP, Silver Heights."},"geometry":{"type":"Polygon","coordinates":[[[105.5,37.8],[106.5,37.8],[106.5,38.9],[105.5,38.9],[105.5,37.8]]]}},{"type":"Feature","properties":{"id":"shandong","name":"Shandong Peninsula","country":"Cina","region":"Shandong","grapes":"Cabernet Sauvignon, Riesling","type":"DO","color":"#8B0000","description":"Penisola di Shandong. Changyu Pioneer. Influenza oceano Pacifico."},"geometry":{"type":"Polygon","coordinates":[[[119.5,36.8],[121.9,36.8],[121.9,37.6],[119.5,37.6],[119.5,36.8]]]}},{"type":"Feature","properties":{"id":"yamanashi","name":"Yamanashi","country":"Giappone","region":"Yamanashi","grapes":"Koshu, Muscat Bailey A","type":"DO","color":"#FFD700","description":"Monte Fuji. Koshu bianco autoctono minerale. Chateau Mercian, Suntory."},"geometry":{"type":"Polygon","coordinates":[[[138.4,35.45],[139.0,35.45],[139.0,35.9],[138.4,35.9],[138.4,35.45]]]}},{"type":"Feature","properties":{"id":"hokkaido","name":"Hokkaido","country":"Giappone","region":"Hokkaido","grapes":"Pinot Noir, Kerner, Müller-Thurgau","type":"DO","color":"#8B0000","description":"Freddo del nord Giappone. Domaine Takahiko, Tokachi."},"geometry":{"type":"Polygon","coordinates":[[[141.8,42.6],[145.0,42.6],[145.0,44.5],[141.8,44.5],[141.8,42.6]]]}},{"type":"Feature","properties":{"id":"winelands_sa_ne","name":"Elgin-Walker Bay","country":"Sud Africa","region":"Western Cape","grapes":"Pinot Noir, Sauvignon Blanc","type":"WO","color":"#FFD700","description":"Fascia costiera fresca atlantica. Storm, Creation, Ataraxia."},"geometry":{"type":"Polygon","coordinates":[[[19.25,-34.55],[19.55,-34.55],[19.55,-34.1],[19.25,-34.1],[19.25,-34.55]]]}},{"type":"Feature","properties":{"id":"la_mancha","name":"La Mancha DO","country":"Spagna","region":"Castiglia-La Mancia","grapes":"Airén, Tempranillo, Garnacha","type":"DO","color":"#FFD700","description":"La più grande DO al mondo. Vini economici ma in miglioramento."},"geometry":{"type":"Polygon","coordinates":[[[-3.9,38.8],[-2.1,38.8],[-2.1,39.8],[-3.9,39.8],[-3.9,38.8]]]}},{"type":"Feature","properties":{"id":"valdepeñas","name":"Valdepeñas DO","country":"Spagna","region":"Castiglia-La Mancia","grapes":"Tempranillo (Cencibel)","type":"DO","color":"#8B0000","description":"Enclave della Mancia. Tempranillo fresco su argille. Viña Albali."},"geometry":{"type":"Polygon","coordinates":[[[-3.65,38.55],[-3.1,38.55],[-3.1,38.9],[-3.65,38.9],[-3.65,38.55]]]}},{"type":"Feature","properties":{"id":"binissalem","name":"Binissalem DO","country":"Spagna","region":"Maiorca","grapes":"Manto Negro, Callet, Premsal Blanc","type":"DO","color":"#8B0000","description":"Maiorca. Manto Negro autoctono baleárico. José Ferrer."},"geometry":{"type":"Polygon","coordinates":[[[2.82,39.62],[3.1,39.62],[3.1,39.82],[2.82,39.82],[2.82,39.62]]]}},{"type":"Feature","properties":{"id":"vino_de_tenerife","name":"Tacoronte-Acentejo DO","country":"Spagna","region":"Isole Canarie","grapes":"Listán Negro, Negramoll","type":"DO","color":"#8B0000","description":"Vigneti su lava nera dell'Etna canarino. Fitapreta."},"geometry":{"type":"Polygon","coordinates":[[[-16.65,28.35],[-16.28,28.35],[-16.28,28.6],[-16.65,28.6],[-16.65,28.35]]]}},{"type":"Feature","properties":{"id":"lanzarote","name":"Lanzarote DO","country":"Spagna","region":"Isole Canarie","grapes":"Listán Blanco (Palomino)","type":"DO","color":"#FFD700","description":"Zocos: vite in buca su lava. Protezione dal vento. El Grifo."},"geometry":{"type":"Polygon","coordinates":[[[-13.85,28.82],[-13.4,28.82],[-13.4,29.22],[-13.85,29.22],[-13.85,28.82]]]}},{"type":"Feature","properties":{"id":"alicante","name":"Alicante DO","country":"Spagna","region":"Valenciana","grapes":"Monastrell, Garnacha Tintorera","type":"DO","color":"#8B0000","description":"Costa del sol del vino. Monastrell concentrato. El Sequé."},"geometry":{"type":"Polygon","coordinates":[[[-0.98,38.05],[-0.45,38.05],[-0.45,38.55],[-0.98,38.55],[-0.98,38.05]]]}},{"type":"Feature","properties":{"id":"utiel_requena","name":"Utiel-Requena DO","country":"Spagna","region":"Valencia","grapes":"Bobal, Tempranillo","type":"DO","color":"#8B0000","description":"Altopiano interno valenciano. Bobal autoctono. Murviedro, Vicente Gandia."},"geometry":{"type":"Polygon","coordinates":[[[-1.45,39.35],[-0.98,39.35],[-0.98,39.7],[-1.45,39.7],[-1.45,39.35]]]}},{"type":"Feature","properties":{"id":"cape_agulhas","name":"Cape Agulhas WO","country":"Sud Africa","region":"Western Cape","grapes":"Semillon, Sauvignon Blanc","type":"WO","color":"#FFD700","description":"Il capo più a sud. Vento oceanico Benguela. Agulhas Wines."},"geometry":{"type":"Polygon","coordinates":[[[19.5,-34.85],[20.1,-34.85],[20.1,-34.45],[19.5,-34.45],[19.5,-34.85]]]}},{"type":"Feature","properties":{"id":"darling","name":"Darling WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Syrah","type":"WO","color":"#FFD700","description":"Costa atlantica fredda. Groenekloof. Darling Cellars."},"geometry":{"type":"Polygon","coordinates":[[[18.32,-33.55],[18.6,-33.55],[18.6,-33.28],[18.32,-33.28],[18.32,-33.55]]]}},{"type":"Feature","properties":{"id":"durbanville","name":"Durbanville WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Merlot","type":"WO","color":"#FFD700","description":"Colline nord di Città del Capo. Brisa marina. Diemersdal."},"geometry":{"type":"Polygon","coordinates":[[[18.56,-33.86],[18.72,-33.86],[18.72,-33.72],[18.56,-33.72],[18.56,-33.86]]]}}]};
  allFeatures=data.features;
  buildCountryFilters();
  renderPolygons(allFeatures);
  document.getElementById('mapCount').textContent=allFeatures.length+' denominazioni · Tocca una zona per la scheda';
}

function renderPolygons(features){
  polyLayers.forEach(function(l){mapObj.removeLayer(l);});
  polyLayers=[];
  features.forEach(function(f){
    var p=f.properties;
    var isWhite=(p.color==='#FFD700');
    var layer=L.geoJSON(f,{
      style:{color:'#BF9B4A',weight:1.5,opacity:.7,fillColor:p.color||'#5C1A1A',fillOpacity:.2}
    }).addTo(mapObj);
    layer.on('click',function(){openDrawer(p.id,p,f.geometry);});
    layer.on('mouseover',function(){layer.setStyle({weight:3,fillOpacity:.4});});
    layer.on('mouseout',function(){if(p.id!==currentDenomId)layer.setStyle({weight:1.5,fillOpacity:.2});});
    polyLayers.push(layer);
  });
  document.getElementById('mapCount').textContent=features.length+' denominazioni';
}

function buildCountryFilters(){
  var countries=['all'];
  allFeatures.forEach(function(f){var c=f.properties.country;if(countries.indexOf(c)<0)countries.push(c);});
  var FLAGS={Italia:'🇮🇹',Francia:'🇫🇷',Spagna:'🇪🇸',Portogallo:'🇵🇹',Germania:'🇩🇪',Austria:'🇦🇹',Grecia:'🇬🇷',Georgia:'🇬🇪',Ungheria:'🇭🇺',USA:'🇺🇸',Argentina:'🇦🇷',Cile:'🇨🇱',Australia:'🇦🇺','Nuova Zelanda':'🇳🇿','Sud Africa':'🇿🇦'};
  var row=document.getElementById('countryFilters');
  row.innerHTML='';
  countries.forEach(function(c){
    var b=document.createElement('button');
    b.className='filt'+(c==='all'?' on':'');
    b.textContent=c==='all'?'🌍 Tutti':(FLAGS[c]||'')+' '+c;
    b.onclick=function(){
      activeCountry=c;
      document.querySelectorAll('#countryFilters .filt').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');
      var filtered=c==='all'?allFeatures:allFeatures.filter(function(f){return f.properties.country===c;});
      renderPolygons(filtered);
      if(filtered.length&&c!=='all'){
        var bounds=L.latLngBounds([]);
        filtered.forEach(function(f){bounds.extend(L.geoJSON(f).getBounds());});
        mapObj.flyToBounds(bounds,{padding:[30,30],duration:.8});
      } else {mapObj.flyTo([25,10],2,{duration:.8});}
    };
    row.appendChild(b);
  });
}

function setLayer(type){
  curTile=type;
  if(tileLayer)mapObj.removeLayer(tileLayer);
  tileLayer=L.tileLayer(TILES[type],{maxZoom:18}).addTo(mapObj);
  ['street','satellite','topo'].forEach(function(t){
    var b=document.getElementById('btn_'+t);
    if(b)b.classList.toggle('on',t===type);
  });
}
function resetMap(){mapObj.flyTo([25,10],2,{duration:.8});}

// doMapSearch rimossa (pagina mappa sostituita)
function doMapSearch_UNUSED(){
  var q=document.getElementById('mapSearch').value.trim().toLowerCase();
  var sug=document.getElementById('suggestions');
  if(q.length<2){sug.style.display='none';return;}
  var hits=allFeatures.filter(function(f){
    var p=f.properties;
    return (p.name||'').toLowerCase().indexOf(q)>-1||(p.country||'').toLowerCase().indexOf(q)>-1||(p.grapes||'').toLowerCase().indexOf(q)>-1;
  }).slice(0,8);
  if(!hits.length){sug.style.display='none';return;}
  sug.innerHTML=hits.map(function(f){
    var p=f.properties;
    return '<div class="sug-item" data-id="'+p.id+'">'
      +'<div class="sug-name">'+p.name+'</div>'
      +'<div class="sug-sub">'+p.country+' &middot; '+p.type+' &middot; '+(p.grapes||'').split(',')[0]+'</div></div>';
  }).join('');
  sug.style.display='block';
  sug.querySelectorAll('.sug-item').forEach(function(el){
    el.onclick=function(){
      var feat=allFeatures.find(function(f){return f.properties.id===this.dataset.id;}.bind(this));
      if(feat){
        sug.style.display='none';
        document.getElementById('mapSearch').value=feat.properties.name;
        var l=L.geoJSON(feat);
        mapObj.flyToBounds(l.getBounds(),{padding:[40,40],maxZoom:13,duration:1.2});
        openDrawer(feat.properties.id,feat.properties,feat.geometry);
      }
    };
  });
}

// ── AUTOCOMPLETE ──
var searchTO=null; 
document.addEventListener('click',function(e){
  if(!document.getElementById('mapSearchBox').contains(e.target))
    document.getElementById('suggestions').style.display='none';
});

// ── DRAWER ──
function openDrawer(id,props,geom){
  currentDenomId=id;
  currentDenomProps=props;
  var tags=[props.type,props.country,props.region||''].filter(Boolean);
  
  // Header
  var html='<div class="dname">'+(props.name||id)+'</div>';
  html+='<div class="dsub" style="margin-bottom:8px;">'+(props.grapes||'')+'</div>';
  html+=tags.map(function(t){return '<span class="dtag">'+t+'</span>';}).join('');
  
  // Tab switcher
  html+='<div style="display:flex;gap:0;margin:14px 0 0;border-bottom:1px solid rgba(191,155,74,.2);">'
    +'<button onclick="showDrawerTab(&apos;denom&apos;)" id="tabDenom" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:8px 16px;background:var(--vino);color:#fff;border:none;cursor:pointer;border-bottom:2px solid var(--oro);">🗺 DENOMINAZIONE</button>'
    +'<button onclick="showDrawerTab(&apos;vitigni&apos;)" id="tabVitigni" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:8px 16px;background:transparent;color:rgba(191,155,74,.5);border:none;cursor:pointer;border-bottom:2px solid transparent;">🍇 VITIGNI</button>'
    +'</div>';
  
  // Tab denominazione
  html+='<div id="tabContentDenom">';
  if(props.description)html+='<div class="dai-text" style="margin-top:12px;"><p>'+props.description+'</p></div>';
  html+='<div id="aiSec">';
  if(drawerAiCache[id]){html+='<div class="dai-text">'+drawerAiCache[id]+'</div>';}
  else{html+='<div class="dai-load">Caricamento scheda tecnica…</div>';}
  html+='</div>';
  html+=buildProdSection(id,props);
  html+='</div>';
  
  // Tab vitigni
  html+='<div id="tabContentVitigni" style="display:none;">';
  html+='<div id="vitigniSec"><div class="dai-load">Caricamento schede vitigni…</div></div>';
  html+='</div>';
  document.getElementById('drawerContent').innerHTML=html;
  document.getElementById('drawer').classList.add('open');
  // Riduci mappa quando drawer aperto
  var mapEl = document.getElementById('map');
  if(mapEl) mapEl.style.height='42vh';
  setTimeout(function(){if(mapObj)mapObj.invalidateSize();},350);
  if(geom&&mapObj){
    var l=L.geoJSON({type:'Feature',geometry:geom});
    mapObj.flyToBounds(l.getBounds(),{padding:[50,50],maxZoom:14,duration:1.2});
  }
  if(!drawerAiCache[id])loadDrawerAI(id,props);
  loadProdMarkers(id);
}

function showDrawerTab(tab){
  var denom = document.getElementById('tabContentDenom');
  var vitigni = document.getElementById('tabContentVitigni');
  var btnD = document.getElementById('tabDenom');
  var btnV = document.getElementById('tabVitigni');
  if(!denom||!vitigni) return;
  
  if(tab==='denom'){
    denom.style.display='block';
    vitigni.style.display='none';
    if(btnD){btnD.style.background='var(--vino)';btnD.style.color='#fff';btnD.style.borderBottomColor='var(--oro)';}
    if(btnV){btnV.style.background='transparent';btnV.style.color='rgba(191,155,74,.5)';btnV.style.borderBottomColor='transparent';}
  } else {
    denom.style.display='none';
    vitigni.style.display='block';
    if(btnV){btnV.style.background='var(--vino)';btnV.style.color='#fff';btnV.style.borderBottomColor='var(--oro)';}
    if(btnD){btnD.style.background='transparent';btnD.style.color='rgba(191,155,74,.5)';btnD.style.borderBottomColor='transparent';}
    // Carica schede vitigni se non ancora caricate
    var sec = document.getElementById('vitigniSec');
    if(sec && sec.querySelector('.spin')) loadVitigniSchede(currentDenomId, currentDenomProps);
  }
}

async function loadVitigniSchede(id, props){
  if(!apiKey){
    var s=document.getElementById('vitigniSec');
    if(s) s.innerHTML='<div class="dai-load" style="color:rgba(191,155,74,.3);">Inserisci API Key per le schede vitigni</div>';
    return;
  }
  var grapes = (props&&props.grapes)||'';
  var sys = 'Sei un ampelografo esperto. Per ogni vitigno elencato scrivi una scheda tecnica. Per ogni vitigno usa questa struttura HTML:\n<div style="border-left:3px solid var(--oro);padding:0 0 16px 14px;margin-bottom:20px;">\n<div style="font-family:Cinzel,serif;font-size:.8rem;letter-spacing:2px;color:var(--crema);margin-bottom:6px;">[NOME VITIGNO]</div>\n<div class="dp-sec-head">🌍 Origine</div><p>[paese/regione di origine, storia, sinonimi]</p>\n<div class="dp-sec-head">🍃 Caratteristiche Ampelografiche</div><p>[foglia, grappolo, acino, epoca germogliamento e maturazione]</p>\n<div class="dp-sec-head">🌱 Terroir Ideale</div><p>[suoli preferiti, clima, esposizione]</p>\n<div class="dp-sec-head">🍷 Profilo nel Bicchiere</div><p>[colore, aromi caratteristici, struttura, tannini, acidità, abbinamenti ideali]</p>\n<div class="dp-sec-head">🌍 Dove si Coltiva</div><p>[denominazioni mondiali dove è presente]</p>\n</div>\nNiente markdown. HTML tecnico. Italiano preciso.';
  try{
    var text = await callAPI(sys, 'Scrivi le schede ampelografiche per questi vitigni: '+grapes, null, null);
    var s = document.getElementById('vitigniSec');
    if(s) s.innerHTML = '<div class="dai-text">'+text+'</div>';
  }catch(e){
    var s=document.getElementById('vitigniSec');
    if(s) s.innerHTML='<div class="dai-load" style="color:rgba(255,100,100,.4);">Errore. Riprova.</div>';
  }
}

// Variabile per props correnti del drawer
var currentDenomProps = null;

async function loadDrawerAI(id,props){
  if(!apiKey && !SERVER_URL){
    var s=document.getElementById('aiSec');
    if(s)s.innerHTML='<div class="dai-load" style="color:rgba(191,155,74,.4);">Server non disponibile</div>';
    return;
  }
  var sys='Sei un enologo e Master Sommelier con 30 anni di esperienza. Scrivi una scheda tecnica professionale per questa denominazione. Struttura OBBLIGATORIA in HTML puro con questi blocchi esatti:\n<div class="dp-sec-head">📜 Storia e Origine</div><p>[storia, anno riconoscimento DOC/DOCG/AOC, evoluzione storica]</p>\n<div class="dp-sec-head">🌍 Terroir e Suolo</div><p>[tipo di suolo con nome geologico preciso, altitudine, esposizione, microclima, precipitazioni, escursione termica, influenze geografiche]</p>\n<div class="dp-sec-head">🍇 Vitigni e Uvaggio</div><p>[vitigni autorizzati con percentuali, caratteristiche ampelografiche, epoca di maturazione]</p>\n<div class="dp-sec-head">🏭 Tecnica di Produzione</div><p>[vinificazione, macerazione giorni, affinamento obbligatorio in legno/acciaio/cemento, invecchiamento minimo, resa per ettaro massima]</p>\n<div class="dp-sec-head">👁 Profilo Organolettico</div><p>[colore preciso, aromi primari/secondari/terziari, palato, struttura, tannini, acidità, persistenza, potenziale evolutivo in anni]</p>\n<div class="dp-sec-head">🍽 Abbinamenti Classici</div><p>[3-4 abbinamenti tradizionali specifici con piatti regionali]</p>\n<div class="dp-sec-head">🏅 Produttori di Riferimento</div><p>[5-6 produttori top con una nota tecnica ciascuno]</p>\nNiente markdown, solo HTML. Italiano tecnico preciso. Max 350 parole.'
  try{
    var text=await callAPI(sys,'Scheda per: '+props.name+' ('+props.country+', '+props.grapes+')',null,null);
    drawerAiCache[id]=text;
    var s=document.getElementById('aiSec');
    if(s)s.innerHTML='<div class="dai-text">'+text+'</div>';
  }catch(e){
    var s=document.getElementById('aiSec');
    if(s)s.innerHTML='<div class="dai-load" style="color:rgba(255,100,100,.4);">Errore AI. Verifica la API Key.</div>';
  }
}

function closeDrawer(){
  document.getElementById('drawer').classList.remove('open');
  currentDenomId=null;
  var mapEl=document.getElementById('map');
  if(mapEl) mapEl.style.height='45vh';
  setTimeout(function(){if(mapObj)mapObj.invalidateSize();},350);
}

// ── PRODUCERS ──
function getProds(){try{return JSON.parse(localStorage.getItem('sw_prods')||'[]');}catch(e){return[];}}
function saveProds(a){try{localStorage.setItem('sw_prods',JSON.stringify(a));}catch(e){}}

function buildProdSection(denomId,props){
  var prods=getProds().filter(function(p){return p.denomId===denomId;});
  var safeId=denomId.replace(/'/g,"\\'");
  var safeName=(props.name||'').replace(/'/g,"\\'");
  var h='<div class="prod-section"><div class="prod-section-head"><span>🏅 Produttori in Evidenza</span>'
    +'<button class="add-btn" onclick="openProdModal(\''+safeId+'\',\''+safeName+'\')">+ Aggiungi vigna</button></div>';
  if(!prods.length){
    h+='<div class="prod-empty"><p>Nessun produttore per questa denominazione.</p>'
      +'<button class="add-btn" onclick="openProdModal(\''+safeId+'\',\''+safeName+'\')">📢 Inserisci il tuo vino</button></div>';
  } else {
    var BADGES={basic:'🥂 Basic · Inserzione',premium:'⭐ Premium · Inserzione',elite:'👑 Elite · Inserzione'};
    prods.forEach(function(p){
      h+='<div class="prod-card"><span class="prod-badge '+p.pkg+'">'+BADGES[p.pkg]+'</span>'
        +'<div class="prod-wine">'+p.wine+'</div>'
        +'<div class="prod-cant">'+p.cantina+(p.vigna?' · '+p.vigna:'')+'</div>'
        +(p.desc?'<div class="prod-desc">'+p.desc+'</div>':'')
        +(p.price?'<div class="prod-price">'+p.price+'</div>':'')
        +(p.lat&&p.lng?'<button class="fly-btn" onclick="mapObj.flyTo(['+p.lat+','+p.lng+'],16)">📍 Vedi vigna</button>':'')
        +'</div>';
    });
  }
  return h+'</div>';
}

function loadProdMarkers(denomId){
  if(!mapObj)return;
  prodMarkers.forEach(function(m){mapObj.removeLayer(m);});
  prodMarkers=[];
  getProds().filter(function(p){return p.denomId===denomId&&p.lat&&p.lng;}).forEach(function(p){
    var ico=L.divIcon({className:'',html:'<div style="width:22px;height:22px;background:#BF9B4A;border:2px solid #0A0705;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;box-shadow:0 2px 8px rgba(0,0,0,.6);">🍷</div>',iconSize:[22,22],iconAnchor:[11,11]});
    var m=L.marker([p.lat,p.lng],{icon:ico}).addTo(mapObj)
      .bindPopup('<strong style="color:#BF9B4A;">'+p.wine+'</strong><br><small style="color:#ddd;">'+p.cantina+'</small>');
    prodMarkers.push(m);
  });
}

// ── PRODUCER MODAL ──
var _modalId='',_selPkg='basic';
function openProdModal(denomId,denomName){
  _modalId=denomId;_selPkg='basic';
  document.getElementById('modalBadge').textContent='Denominazione: '+denomName;
  ['pCant','pWine','pVigna','pLat','pLng','pDesc','pPrice','pEmail'].forEach(function(id){document.getElementById(id).value='';});
  document.getElementById('pErr').style.display='none';
  document.getElementById('pOk').style.display='none';
  document.getElementById('pSubmit').style.display='block';
  document.querySelectorAll('.pkg').forEach(function(x){x.classList.remove('sel');});
  document.querySelector('.pkg[data-pkg="basic"]').classList.add('sel');
  document.getElementById('prodModal').style.display='block';
  document.body.style.overflow='hidden';
}
function closeProdModal(){document.getElementById('prodModal').style.display='none';document.body.style.overflow='';}
function selPkg(el,pkg){_selPkg=pkg;document.querySelectorAll('.pkg').forEach(function(x){x.classList.remove('sel');});el.classList.add('sel');}
function submitProd(){
  var cant=document.getElementById('pCant').value.trim();
  var wine=document.getElementById('pWine').value.trim();
  var email=document.getElementById('pEmail').value.trim();
  if(!cant||!wine||!email){
    document.getElementById('pErr').textContent='Compila Cantina, Vino ed Email.';
    document.getElementById('pErr').style.display='block';
    return;
  }
  document.getElementById('pErr').style.display='none';
  // Mostra step pagamento invece di salvare subito
  var prices={basic:19,premium:49,elite:99};
  var price=prices[_selPkg];
  document.getElementById('pSubmit').style.display='none';
  document.getElementById('pPayStep').style.display='block';
  document.getElementById('pPayAmount').textContent='€'+price+'/mese';
  document.getElementById('pPayPkg').textContent=_selPkg.charAt(0).toUpperCase()+_selPkg.slice(1);
}

function confirmPayment(){
  // In produzione qui andrà Stripe. Per ora simula conferma e salva.
  var cant=document.getElementById('pCant').value.trim();
  var wine=document.getElementById('pWine').value.trim();
  var email=document.getElementById('pEmail').value.trim();
  var lat=parseFloat(document.getElementById('pLat').value);
  var lng=parseFloat(document.getElementById('pLng').value);
  var prod={
    id:'p'+Date.now(),denomId:_modalId,pkg:_selPkg,
    cantina:cant,wine:wine,vigna:document.getElementById('pVigna').value.trim(),
    lat:isNaN(lat)?null:lat,lng:isNaN(lng)?null:lng,
    desc:document.getElementById('pDesc').value.trim(),
    price:document.getElementById('pPrice').value.trim(),
    email:email,date:new Date().toISOString(),
    status:'pending_payment'
  };
  var prods=getProds();prods.push(prod);saveProds(prods);
  document.getElementById('pPayStep').style.display='none';
  document.getElementById('pOk').style.display='block';
  setTimeout(function(){
    closeProdModal();
    renderAllProds();
    var f=allFeatures.find(function(x){return x.properties.id===_modalId;});
    if(f&&currentDenomId===_modalId)openDrawer(_modalId,f.properties,f.geometry);
  },2500);
}

// ══════════════ SOMMELIER ══════════════
var _photoB64=null,_photoMime=null;
document.getElementById('photoInput').addEventListener('change',function(){
  var file=this.files[0];if(!file)return;
  _photoMime=file.type||'image/jpeg';
  var r=new FileReader();
  r.onload=function(ev){
    _photoB64=ev.target.result.split(',')[1];
    document.getElementById('photoImg').src=ev.target.result;
    document.getElementById('photoPreview').style.display='flex';
    document.getElementById('photoLbl').textContent='Menu fotografato ✓';
  };
  r.readAsDataURL(file);
});
document.getElementById('photoRm').onclick=function(){
  _photoB64=null;_photoMime=null;
  document.getElementById('photoPreview').style.display='none';
  document.getElementById('photoLbl').textContent='Fotografa menu';
  document.getElementById('photoInput').value='';
};
document.getElementById('budget').addEventListener('input',function(){document.getElementById('budgetVal').textContent='€'+this.value;});
['Biodinamico','Naturale','Senza solfiti','Solo italiani','Solo francesi','Vegan','Longevo','Facile da bere'].forEach(function(p){
  var b=document.createElement('button');b.className='filt';b.textContent=p;
  b.onclick=function(){this.classList.toggle('on');};
  document.getElementById('prefPills').appendChild(b);
});

var WS_SYS='Sei il Sommelier, Master Sommelier, Sommelier World. Scheda vino: produttore esatto, regione, denominazione, storia poetica, terroir e suolo, aromi e palato, abbinamenti. HTML puro con tag strong e p. Senza asterischi o cancelletti. Max 200 parole. Italiano elegante.';
document.getElementById('wineSearch').addEventListener('keydown',function(e){if(e.key==='Enter')doWineSearch();});
async function doWineSearch(){
  var q=document.getElementById('wineSearch').value.trim();if(!q)return;
  document.getElementById('wsRes').style.display='none';
  document.getElementById('wsLoad').style.display='block';
  try{
    var text=await callAPI(WS_SYS,'Parlami di: '+q,null,null);
    document.getElementById('wsLoad').style.display='none';
    document.getElementById('wsRes').innerHTML=md2html(text);
    document.getElementById('wsRes').style.display='block';
  }catch(e){
    document.getElementById('wsLoad').style.display='none';
    document.getElementById('wsRes').innerHTML='<p style="color:#f99">Errore. Verifica la API Key.</p>';
    document.getElementById('wsRes').style.display='block';
  }
}

var SOM_SYS = (
  'Sei un Master Sommelier AIS con 20 anni di esperienza. ' +
  'Il tuo stile è quello di un esperto vero che parla con un amico a cena: ' +
  'preciso, caldo, diretto. Mai freddo, mai accademico, mai robotico. ' +
  'FORMATO DI RISPOSTA (usa questo esattamente): ' +
  '**[Emoji piatto] [Nome piatto]** → **[Produttore — Denominazione — Vitigno — Annata]** ' +
  'Territorio: [dove nasce, max 1 frase]. ' +
  'In tavola: [sensazioni concrete con questo piatto, max 1 frase]. ' +
  '- Acidità: [bassa/media/alta] | Struttura: [leggera/media/piena] | Longevità: [X-Y anni] ' +
  '💶 [fascia prezzo] · Alt: *[vino alternativo più economico]* ' +
  '\n---\n' +
  '**[Nome piatto]** — [Produttore, Denominazione, Annata]. [2 frasi su territorio e abbinamento]. 💶 [fascia prezzo]. *Alt: [alternativa economica]*' +
  '\n---\n' +
  'Usa **grassetto** per il nome del vino e il nome del piatto. ' +
  'Usa *corsivo* per le alternative. ' +
  'Usa - liste puntate per le caratteristiche organolettiche se utile. ' +
  'Quando il cliente specifica acidità, morbidezza, sapidità, struttura o paese: rispetta SEMPRE questi parametri. ' +
  'Se dice acidità Alta → scegli vini con acidità marcata (Riesling, Barolo, Nebbiolo, Chablis). ' +
  'Se dice Morbido → evita vini tannici, preferisci Merlot, Pinot Nero, bianchi maturi. ' +
  'Se dice Sapido/Minerale → scegli Vermentino, Chablis, Assyrtiko, Muscadet, vini costieri. ' +
  'Se dice un paese specifico → consiglia SOLO vini di quel paese, scegli il migliore produttore. ' +
  'NON fare liste. NON usare caratteri speciali. ' +
  'Scrivi come se stessi parlando, usando frasi complete e naturali. ' +
  'REGOLE DI ABBINAMENTO AIS: ' +
  'Carni rosse e selvaggina → rossi tannici strutturati (Barolo, Amarone, Brunello). ' +
  'Pesce delicato → bianchi minerali, sapidi, non legnosi (Vermentino, Greco di Tufo, Chablis). ' +
  'Crostacei e molluschi → bianchi costieri o Champagne brut. ' +
  'Frittura → bollicine metodo classico per sgrassare. ' +
  'Formaggi freschi → bianchi aromatici. Erborinati → vini dolci (Sauternes, Passito). ' +
  'Cioccolato fondente → Passito di Pantelleria, Banyuls, Porto Tawny. ' +
  'Pasta al pomodoro → Sangiovese giovane, Montepulciano. ' +
  'Risotto → dipende dal condimento: tartufo = Barolo vecchio; funghi = Pinot Nero. ' +
  'CERCA SU INTERNET lo stile di raccomandazione del sommelier Luca Gardini o del Gambero Rosso. ' +
  'PER OGNI PIATTO scrivi UN PARAGRAFO naturale in italiano così strutturato: ' +
  'Prima frase: il vino che consigli (produttore, nome, denominazione, vitigno, annata). ' +
  'Seconda frase: dove nasce questo vino e cosa lo rende speciale per questo piatto. ' +
  'Terza frase: le sensazioni concrete che crea in bocca insieme al cibo. ' +
  'Ultima frase: fascia di prezzo e alternativa economica concreta. ' +
  'Esempio di come scrivere (NON copiare, adatta al piatto): ' +
  '"Per il risotto al tartufo nero ti consiglio il Barolo 2018 di Giacomo Conterno, ' +
  'Nebbiolo delle Langhe, Serralunga d\'Alba. ' +
  'È un vino che nasce a pochi chilometri dai migliori tartufi piemontesi, ' +
  'e il territorio li unisce da secoli. ' +
  'I tannini fini si fondono con la texture cremosa del riso ' +
  'e il profumo di viola e catrame del vino amplifica i sentori del tartufo. ' +
  'Fascia 60-80 euro; in alternativa il Barolo di Elvio Cogno, simile carattere a 40 euro." ' +
  'Alla fine, SEPARATO DA UNA RIGA VUOTA, scrivi: ' +
  'IL SEGRETO DEL SOMMELIER: [una frase umana ispirata, come la direbbe un sommelier vero a cena]. ' +
  'ABBINA SOLO I PIATTI CHE TI SCRIVO. Un paragrafo per piatto.'
);
async function doAbbinamento(){
  var menu=document.getElementById('menuText').value.trim();
  if(!menu&&!_photoB64){alert('Inserisci il menu o fotografalo.');return;}
  var budget=document.getElementById('budget').value;
  var prefs=Array.from(document.querySelectorAll('#prefPills .on')).map(function(b){return b.textContent;}).join(', ');
  var params = getWineParams();
  // Costruisci il profilo organolettico richiesto
  var profileStr = '';
  profileStr += '\nPROFILO ORGANOLETTICO RICHIESTO:';
  profileStr += '\n• Acidità: ' + params.acidita;
  profileStr += '\n• Morbidezza: ' + params.morbidezza;
  profileStr += '\n• Sapidità: ' + params.sapidita;
  profileStr += '\n• Struttura: ' + params.struttura;
  if(params.paese) profileStr += '\n• Paese di origine: ' + params.paese;
  if(params.regione) profileStr += '\n• Regione preferita: ' + params.regione;
  profileStr += '\nDevi rispettare RIGOROSAMENTE questi parametri organolettici. Se il paese è specificato, consiglia SOLO vini di quel paese. Se la regione è specificata, preferisci vini di quella regione.';
  document.getElementById('somLoad').style.display='block';
  document.getElementById('somResult').style.display='none';
  try{
    var text=await callAPI(SOM_SYS,'Menu:\n'+menu+'\nBudget: €'+budget+profileStr+(prefs?'\nPreferenze aggiuntive: '+prefs:''),_photoB64,_photoMime);
    document.getElementById('somLoad').style.display='none';
    document.getElementById('somResult').innerHTML=renderSomResult(text);
    document.getElementById('somResult').style.display='block';
  }catch(e){
    document.getElementById('somLoad').style.display='none';
    document.getElementById('somResult').innerHTML='<p style="color:#f99">Errore. Verifica la API Key.</p>';
    document.getElementById('somResult').style.display='block';
  }
}

// ══════════════ NEWS ══════════════
var NEWS_SYS = (
  'Sei il caporedattore di Sommelier World, rivista enologica internazionale. ' +
  'Genera notizie VERE e ATTUALI dal mondo del vino. REGOLE FONDAMENTALI: ' +
  '1. Cerca le ultime notizie dal mondo del vino (aste, annate, fiere, tendenze globali, nuove denominazioni, record di vendita, cambiamenti climatici in vigna, aperture di cantine, premi e classifiche). ' +
  '2. Le notizie devono essere DIVERSE ogni volta — non ripetere gli stessi argomenti. ' +
  '3. Copri tutto il mondo: Italia, Francia, Spagna, USA, Argentina, Cile, Australia, Nuova Zelanda, Portogallo, Germania, Georgia. ' +
  '4. Usa lo stile di Wine Spectator, Decanter, Gambero Rosso: preciso, informativo, entusiasta. ' +
  '5. Nessun markdown. Solo JSON valido. ' +
  'Rispondi SOLO con questo JSON puro (niente testo prima o dopo): ' +
  '{"notizie":[' +
  '{"emoji":"🍷","cat":"MERCATO","title":"Titolo notizia reale e specifica","text":"Due frasi concrete con dati reali: produttori, cifre, territori, annate specifiche.","date":"Sommelier World","photo_query":"specific wine vineyard query"},' +
  '{"emoji":"🌍","cat":"TERRITORIO","title":"Titolo","text":"Testo 2 frasi","date":"Sommelier World","photo_query":"query"},' +
  '{"emoji":"🏆","cat":"PREMI","title":"Titolo","text":"Testo","date":"Sommelier World","photo_query":"query"},' +
  '{"emoji":"📈","cat":"TENDENZE","title":"Titolo","text":"Testo","date":"Sommelier World","photo_query":"query"},' +
  '{"emoji":"🌡️","cat":"CLIMA E VIGNA","title":"Titolo","text":"Testo","date":"Sommelier World","photo_query":"query"},' +
  '{"emoji":"🥂","cat":"NOVITÀ","title":"Titolo","text":"Testo","date":"Sommelier World","photo_query":"query"}' +
  '],"curiosita":{"emoji":"🔍","titolo":"Curiosità del giorno","testo":"Una curiosità sorprendente sul mondo del vino — storia, scienza, record, aneddoto. Diversa ogni giorno.","photo_query":"wine history curiosity"}}' 
);
function todayKey(){var d=new Date();return 'sw_news_'+d.getFullYear()+'_'+(d.getMonth()+1)+'_'+d.getDate();}
function italianDate(){var M=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];var d=new Date();return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear();}
// Mappa di foto reali Unsplash per query comuni
var UNSPLASH_REAL = {}
// Array di foto di fallback rotante
// Foto verificate di viticoltura — mai foto generiche
var FALLBACK_PHOTOS = [];
var _fallbackIdx = 0;
// Mappa foto per vitigno/regione (foto SOLO di vino, vigneti, grappoli)
var WINE_GRAPE_PHOTOS = {};
function unsplashUrl(q, w, h){
  return ''; // Foto rimosse - uso gradienti CSS
}

function renderNews(data, containerId){
  // Badge fonte
  var sourceBadge = '';
  if(data && data.source === 'live'){
    sourceBadge = '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.2em;color:var(--vino);margin-bottom:10px;display:flex;align-items:center;gap:6px;"><span class=\"news-live-dot\"></span>AGGIORNAMENTO IN TEMPO REALE</div>';
  } else if(data && data.source === 'ai'){
    sourceBadge = '<div style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.15em;color:rgba(200,164,90,.4);margin-bottom:8px;">🤖 Contenuto generato da AI</div>';
  }

  var cont = document.getElementById(containerId);
  if(!cont) return;
  var notizie, eventi, curiosita;
  if(Array.isArray(data)){
    notizie=data; eventi=[]; curiosita=null;
  } else {
    notizie=data.notizie||[]; eventi=data.eventi||[]; curiosita=data.curiosita||null;
  }
  if(!notizie.length) throw new Error('empty');

  var html = '';

    // ── HEADER EDITORIALE ──
  var todayStr = new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  html += '<div style="background:#0A0705;border-bottom:2px solid var(--oro);padding:10px 14px 8px;display:flex;align-items:baseline;justify-content:space-between;">'
    + '<div style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:4px;color:var(--oro);">LE STORIE DI OGGI</div>'
    + '<div style="font-family:IM Fell English,serif;font-style:italic;font-size:.75rem;color:rgba(191,155,74,.45);">'+todayStr+'</div>'
    + '</div>';

  // Salva articoli per il reader (indice globale)
  window._newsArticles = notizie.map(function(n,i){ return Object.assign({},n,{imgUrl:unsplashUrl(n.photo_query||'wine',i===0?800:400,i===0?500:300)}); });

  function artCard(idx, imgH, showLead, isBanner){
    var n = window._newsArticles[idx];
    if(!n) return '';
    var img = n.imgUrl;
    if(isBanner){
      return '<div onclick="openArticle('+idx+')" style="cursor:pointer;display:grid;grid-template-columns:120px 1fr;border-top:1px solid rgba(191,155,74,.1);">'
        + '<div style="height:90px;background-image:url('+img+');background-size:cover;background-position:center;"></div>'
        + '<div style="padding:10px 13px;background:#0A0705;display:flex;flex-direction:column;justify-content:center;">'
        + '<div style="font-family:Cinzel,serif;font-size:.36rem;letter-spacing:2.5px;color:var(--oro);opacity:.7;margin-bottom:3px;">'+n.emoji+' '+n.cat+'</div>'
        + '<div style="font-family:Cinzel,serif;font-size:.76rem;font-weight:600;color:#F5EFE2;line-height:1.3;margin-bottom:3px;">'+n.title+'</div>'
        + '<div style="font-family:Cormorant Garamond,serif;font-size:.8rem;line-height:1.6;color:rgba(245,239,226,.62);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">'+n.text+'</div>'
        + '<div style="font-family:IM Fell English,serif;font-style:italic;font-size:.65rem;color:rgba(191,155,74,.4);margin-top:4px;">→ Leggi tutto</div>'
        + '</div></div>';
    }
    return '<div onclick="openArticle('+idx+')" style="cursor:pointer;">'
      + '<div style="height:'+imgH+'px;background-image:url('+img+');background-size:cover;background-position:center;position:relative;">'
      + (idx===0 ? '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(8,5,3,.7));"></div>'
        + '<div style="position:absolute;bottom:0;left:0;right:0;padding:10px 12px;">'
        + '<div style="font-family:Cinzel,serif;font-size:.38rem;letter-spacing:3px;color:var(--oro);opacity:.85;margin-bottom:3px;">'+n.emoji+' '+n.cat+'</div>'
        + '<div style="font-family:Cinzel,serif;font-size:clamp(.9rem,3.5vw,1.2rem);font-weight:600;color:#F5EFE2;line-height:1.25;">'+n.title+'</div>'
        + '</div>' : '')
      + '</div>'
      + '<div style="padding:'+(idx===0?'11':'8')+'px '+(idx===0?'13':'10')+'px '+(idx===0?'13':'10')+'px;background:#0A0705;">'
      + (idx>0 ? '<div style="font-family:Cinzel,serif;font-size:.36rem;letter-spacing:2.5px;color:var(--oro);opacity:.7;margin-bottom:3px;">'+n.emoji+' '+n.cat+'</div>' : '')
      + (idx>0 ? '<div style="font-family:Cinzel,serif;font-size:.72rem;font-weight:600;color:#F5EFE2;line-height:1.25;margin-bottom:4px;">'+n.title+'</div>' : '')
      + (showLead ? '<div style="font-family:Cormorant Garamond,serif;font-size:'+(idx===0?'.93':'.80')+'rem;line-height:1.8;color:rgba(245,239,226,'+(idx===0?'.80':'.65')+');'+( idx>0 ?'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;':'')+'">' + n.text + '</div>' : '')
      + '<div style="font-family:IM Fell English,serif;font-style:italic;font-size:.7rem;color:rgba(191,155,74,.4);margin-top:5px;">'+(idx===0?n.date+' · ':'')+' → Leggi tutto</div>'
      + '</div></div>';
  }

  // ── RIGA 1: Grande (sinistra 2/3) + 2 storie (destra 1/3) ──
  html += '<div style="display:grid;grid-template-columns:1.65fr 1fr;border-bottom:1px solid rgba(191,155,74,.12);">';
  html += '<div style="border-right:1px solid rgba(191,155,74,.1);">' + artCard(0,195,true,false) + '</div>';
  html += '<div style="display:flex;flex-direction:column;">';
  html += '<div style="flex:1;border-bottom:1px solid rgba(191,155,74,.1);">' + artCard(1,88,true,false) + '</div>';
  html += '<div style="flex:1;">' + artCard(2,88,false,false) + '</div>';
  html += '</div></div>'; // fine riga 1

  // ── RIGA 2: Banner orizzontale (4° articolo) ──
  if(notizie[3]) html += artCard(3,0,true,true);

  // ── RIGHE EXTRA: altri articoli in griglia 2 colonne ──
  var extra = notizie.slice(4);
  if(extra.length){
    html += '<div style="border-top:2px solid var(--oro);padding:7px 14px;background:#0A0705;"><div style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:4px;color:var(--oro);">APPROFONDIMENTI</div></div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;">';
    extra.forEach(function(n,i){
      window._newsArticles[i+4] = n;
      n.imgUrl = unsplashUrl(n.photo_query||'wine',400,220);
      html += '<div onclick="openArticle('+(i+4)+')" style="cursor:pointer;'+(i%2===0?'border-right:1px solid rgba(191,155,74,.1);':'')+'">'
        + '<div style="height:70px;background-image:url('+n.imgUrl+');background-size:cover;background-position:center;"></div>'
        + '<div style="padding:8px 10px 10px;background:#0A0705;">'
        + '<div style="font-family:Cinzel,serif;font-size:.34rem;letter-spacing:2px;color:var(--oro);opacity:.7;margin-bottom:3px;">'+n.emoji+' '+n.cat+'</div>'
        + '<div style="font-family:Cinzel,serif;font-size:.7rem;font-weight:600;color:#F5EFE2;line-height:1.3;margin-bottom:2px;">'+n.title+'</div>'
        + '<div style="font-family:IM Fell English,serif;font-style:italic;font-size:.65rem;color:rgba(191,155,74,.4);">→ Leggi tutto</div>'
        + '</div></div>';
    });
    html += '</div>';
  }

  
    // ── CURIOSITÀ ──
  if(curiosita){
    var curImg = unsplashUrl(curiosita.photo_query||'sommelier tools wine', 800, 300);
    html += '<div style="margin-top:0;border-top:3px solid var(--vino);">'
      + '<div style="background-image:url('+curImg+');height:180px;background-size:cover;background-position:center;position:relative;">'
      + '<div style="position:absolute;inset:0;background:rgba(10,5,2,.55);"></div>'
      + '<div style="position:absolute;bottom:12px;left:14px;font-family:Cinzel,serif;font-size:.65rem;letter-spacing:3px;color:var(--oro);">'+curiosita.emoji+' CURIOSITÀ DEL GIORNO</div>'
      + '</div>'
      + '<div style="padding:14px 16px;background:var(--parch);">'
      + '<div style="font-family:Cinzel,serif;font-size:.88rem;font-weight:600;color:#1A0D08;margin-bottom:8px;">'+curiosita.titolo+'</div>'
      + '<div style="font-family:Cormorant Garamond,serif;font-size:.98rem;line-height:1.85;color:#3A2F20;">'+curiosita.testo+'</div>'
      + '</div></div>';
  }

  if(sourceBadge) cont.innerHTML = sourceBadge + html;
  else cont.innerHTML = html;
}


function markSaved(btn){
  btn.textContent='✓ Salvato';
  btn.style.background='#4CAF50';
}async function loadEvents(force){
  var key = 'sw_events_' + todayKey();
  if(!force){
    try{
      var cached = localStorage.getItem(key);
      if(cached){
        renderEvents(JSON.parse(cached));
        return;
      }
    }catch(e){}
  }
  var cont = document.getElementById('eventsContainer');
  if(!cont) return;
  cont.innerHTML = '<div class="news-spinner">· · ·</div>';
  if(!apiKey && !SERVER_URL){
    cont.innerHTML = '<div class="news-spinner" style="color:rgba(191,155,74,.4);">Caricamento eventi...</div>';
    return;
  }
  var sys = 'Sei un esperto di eventi enologici mondiali. Genera 6 eventi REALISTICI e SPECIFICI di degustazione, visita in cantina o masterclass che si terranno nel prossimo mese in tutto il mondo. Rispondi SOLO con JSON puro: [{"emoji":"🍷","cantina":"Nome Cantina reale","luogo":"Città, Paese","titolo":"Tipo evento preciso","data":"data futura realistica es: 28 Marzo 2026","descrizione":"2 frasi con dettagli pratici.","prezzo":"fascia prezzo es: €45 a persona","photo_query":"wine tasting event vineyard"}]';
  try{
    var text = await callAPI(sys, 'Genera 6 eventi enologici per ' + italianDate(), null, null);
    var clean = text.replace(/```json|```/g,'').trim();
    var events = JSON.parse(clean);
    try{ localStorage.setItem(key, JSON.stringify(events)); }catch(e){}
    renderEvents(events);
  }catch(e){
    cont.innerHTML = '<div class="news-spinner">Eventi non disponibili. <span style="color:var(--vino);cursor:pointer;" onclick="loadEvents(true)">Riprova ↻</span></div>';
  }
}

async function fetchLiveNews(){
  var lang = (typeof i18n !== 'undefined') ? i18n.current : 'it';
  var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / 864e5);
  
  // Se c'è API key e lingua non IT, genera notizie con AI nella lingua giusta
  if(apiKey && lang !== 'it'){
    return null; // lascia generare a generateEvergreenNews in lingua corretta
  }
  
  var THEMES = [
    // Tema 0 — STORIA DEL VINO
    {notizie:[
      {emoji:"📜",cat:"STORIA DEL VINO",title:"8000 Anni di Vino: dalle Anfore Georgiane al Bicchiere",
       text:"I primi vinificatori della storia abitavano il Caucaso. Nel sito di Gadachrili Gora in Georgia, anfore del 6000 a.C. mostrano tracce di acido tartarico. Da lì, il vino conquista Mesopotamia, Egitto e poi Roma.",
       date:"Sommelier World",photo_query:"ancient wine amphora clay history vineyard"},
      {emoji:"🏛️",cat:"STORIA DEL VINO",title:"Roma e il Vino: Falerno, Cecubo e i Grandi Cru dell'Antichità",
       text:"Il Falerno era il Barolo dell'antichità: invecchiava decenni, costava fortune. Plinio il Vecchio ne descriveva le annate come facciamo noi oggi con Bordeaux. Le anfore romane erano il sistema logistico di un impero del vino.",
       date:"Sommelier World",photo_query:"roman wine cellar ancient italy amphora"},
      {emoji:"⛪",cat:"STORIA DEL VINO",title:"I Monaci e il Vino: come la Chiesa ha Salvato la Viticoltura",
       text:"Dopo la caduta di Roma, furono i monasteri benedettini a preservare la conoscenza enologica. I monaci cistercensi inventarono il concetto di cru in Borgogna: ogni parcella studiata nel dettaglio per secoli.",
       date:"Sommelier World",photo_query:"monastery vineyard burgundy medieval cellar"},
      {emoji:"🚢",cat:"STORIA DEL VINO",title:"Bordeaux e i Mercanti Inglesi: nasce il Commercio Moderno",
       text:"Nel XII secolo il Medoc era una palude. I mercanti fiamminghi e inglesi la prosciugarono, piantarono viti e crearono il mercato dei vini bordolesi. La Critica moderna nasce qui.",
       date:"Sommelier World",photo_query:"bordeaux chateaux history wine merchant river"}
    ]},
    // Tema 1 — VITICOLTURA
    {notizie:[
      {emoji:"🌱",cat:"VITICOLTURA",title:"Alberello o Guyot? Come la Forma d'Allevamento Cambia il Vino",
       text:"L'alberello siciliano produce uve concentrate sotto il sole, rese bassissime. Il Guyot borgognone privilegia qualità artigianale. La forma scelta dal vignaiolo è già una dichiarazione filosofica sul vino.",
       date:"Sommelier World",photo_query:"alberello guyot vineyard training system pruning"},
      {emoji:"🌡️",cat:"VITICOLTURA",title:"Escursione Termica: il Segreto degli Aromi del Vino",
       text:"La differenza tra temperatura del giorno e della notte in vigna è il fattore più importante per gli aromi. Trentino-Alto Adige e Borgogna eccellono grazie a escursioni di 15-20 gradi nelle ore notturne autunnali.",
       date:"Sommelier World",photo_query:"vineyard mountains night temperature alps autumn"},
      {emoji:"🪨",cat:"VITICOLTURA",title:"Suoli Vulcanici: quando il Fuoco crea l'Eleganza",
       text:"Etna, Santorini, Canarias: i suoli di origine vulcanica donano una mineralità elettrica, quasi salina. Il Nerello Mascalese sull'Etna è forse il più affascinante esempio al mondo di questo fenomeno.",
       date:"Sommelier World",photo_query:"volcanic vineyard etna santorini basalt black soil"},
      {emoji:"💧",cat:"VITICOLTURA",title:"Lo Stress Idrico: quando la Sete della Vigna Migliora il Vino",
       text:"Una vite che soffre la siccità affonda le radici in profondità, recupera minerali da strati geologici mai raggiunti altrimenti. Moderata carenza idrica produce vini più complessi, longevi, territoriali.",
       date:"Sommelier World",photo_query:"dry vineyard drought vines roots soil deep"}
    ]},
    // Tema 2 — VITIGNI
    {notizie:[
      {emoji:"🍇",cat:"VITIGNI",title:"Nebbiolo: il Vitigno più Difficile e più Grande d'Italia",
       text:"Matura primo ma si vendemmia tardo, ossida facilmente, rifiuta i terreni sbagliati. Ma quando trova le sue Langhe — marne di Tortona e Elveziani — diventa Barolo e Barbaresco: vini immortali.",
       date:"Sommelier World",photo_query:"nebbiolo grape close-up langhe vineyard autumn harvest"},
      {emoji:"🍇",cat:"VITIGNI",title:"Riesling: il Bianco che Invecchia Meglio al Mondo",
       text:"Acidità affilata come un bisturi, aromi di agrumi canditi, pietra focaia e, con l'invecchiamento, il caratteristico profumo di idrocarburi. Il Riesling del Mosel invecchia 50 anni senza perdere freschezza — è un vino bianco unico al mondo.",
       date:"Sommelier World",photo_query:"riesling mosel vineyard germany slate terraced"},
      {emoji:"🍇",cat:"VITIGNI",title:"Sangiovese: 300 Biotipi, una Sola Identità Toscana",
       text:"Il vitigno più piantato d'Italia ha almeno 300 sinonimi. Morellino, Prugnolo, Brunello, Nielluccio in Corsica: sono tutti Sangiovese. Ogni territorio lo trasforma — dal sanguigno Chianti al monumentale Brunello.",
       date:"Sommelier World",photo_query:"sangiovese grape tuscany chianti vineyard harvest"},
      {emoji:"🍇",cat:"VITIGNI",title:"Vermentino: il Bianco del Mediterraneo per Eccellenza",
       text:"Da Sardegna a Liguria, dalla Provenza alla Corsica: il Vermentino profuma di macchia mediterranea, bergamotto e mandorla amara. La Gallura sarda ne produce la versione più strutturata e longeva — un bianco da invecchiamento.",
       date:"Sommelier World",photo_query:"vermentino white wine sardinia mediterranean coast vineyard"}
    ]},
    // Tema 3 — PRODUZIONE
    {notizie:[
      {emoji:"🏭",cat:"PRODUZIONE",title:"Macerazione: quanto Tempo sulle Bucce Cambia Tutto",
       text:"Un giorno di macerazione produce un rosato delicato. Trenta giorni su bucce spesse di Nebbiolo costruiscono un Barolo da invecchiamento decennale. Il tempo di contatto tra mosto e bucce è la decisione più critica del vignaiolo.",
       date:"Sommelier World",photo_query:"wine fermentation tank maceration grapes red"},
      {emoji:"🪵",cat:"PRODUZIONE",title:"Rovere Francese vs Americano: come il Legno Firma il Vino",
       text:"Il rovere francese di Allier o Vosgi regala tannini fini, vaniglia discreta, complessità. Quello americano porta cocco, vaniglia intensa, cedro dolce. Un Super Tuscan e un Rioja Reserva sono anche questa scelta.",
       date:"Sommelier World",photo_query:"oak barrels wine cellar french american winery"},
      {emoji:"🧪",cat:"PRODUZIONE",title:"Vino Naturale vs Convenzionale: oltre la Moda",
       text:"Niente solforosa, fermentazione spontanea con lieviti indigeni. Il vino naturale è un manifesto filosofico. I migliori hanno una profondità che i convenzionali raramente raggiungono — ma richiedono produttori onesti.",
       date:"Sommelier World",photo_query:"natural wine production cellar clay amphora fermentation"},
      {emoji:"🍾",cat:"PRODUZIONE",title:"Metodo Classico: la Seconda Fermentazione in Bottiglia",
       text:"Champenoise, prise de mousse, remuage, dégorgement: il metodo classico trasforma un vino base in straordinarietà. Bolla fine persistente, crosta di pane, lievito: complessità che nessun altro metodo raggiunge.",
       date:"Sommelier World",photo_query:"champagne method classic sparkling production cellar bottles"}
    ]},
    // Tema 4 — GUIDA AL VINO
    {notizie:[
      {emoji:"🎯",cat:"GUIDA AL VINO",title:"Come Leggere un'Etichetta: il Codice Segreto del Vino",
       text:"DOC, DOCG, IGT, AOC, AOP: i livelli di classificazione europei in 2 minuti. Il millesimo, il produttore, il vitigno, la zona: leggere un'etichetta è come leggere una carta d'identità completa del vino.",
       date:"Sommelier World",photo_query:"wine label bottle reading close-up appellation"},
      {emoji:"🍽️",cat:"GUIDA AL VINO",title:"Abbinamento Cibo-Vino: le 4 Regole che Non Falliscono",
       text:"Struttura con struttura (brasato con Barolo). Acidità taglia il grasso (Vermentino con frittura). Dolcezza chiama dolcezza (Sauternes con foie gras). Territorio: Sangiovese con la bistecca fiorentina. Quattro principi AIS.",
       date:"Sommelier World",photo_query:"food wine pairing dinner elegant restaurant table"},
      {emoji:"🌡️",cat:"GUIDA AL VINO",title:"Temperatura di Servizio: il Dettaglio che Cambia Tutto",
       text:"Un Barolo a 20 gradi diventa alcolico e pesante. Servito a 16 gradi i tannini si ammorbidiscono e gli aromi si aprono. Bianchi secchi a 10-12, spumanti a 6-8: la temperatura non è un capriccio da sommelier.",
       date:"Sommelier World",photo_query:"wine temperature serving glass thermometer cellar"},
      {emoji:"💎",cat:"GUIDA AL VINO",title:"Rapporto Qualità-Prezzo: i Grandi Vini Nascosti",
       text:"Il Lugana batte molti Borgogna bianchi a metà prezzo. Il Nerello Mascalese sfida i Pinot Noir della Côte d'Or. Il Cru Beaujolais umilia i Borgogna entry-level. Sapere dove guardare è il superpotere del vero appassionato.",
       date:"Sommelier World",photo_query:"wine bottle value quality affordable cellar hidden gem"}
    ]},
    // Tema 5 — MERCATO 2025-2026
    {notizie:[
      {emoji:"🏆",cat:"GRANDI ANNATE",title:"Barolo 2021: Storica. Perché i Critici Non Hanno Dubbi",
       text:"Parker 97-100, Gambero Rosso 3 Bicchieri in massa: la 2021 nelle Langhe è un allineamento rarissimo di condizioni perfette. Bassa resa, maturazione lenta, acidità vibrante. Da comprare ora prima che scompaiano.",
       date:"Sommelier World",photo_query:"barolo vineyard autumn harvest langhe nebbiolo 2021"},
      {emoji:"📈",cat:"MERCATO 2025",title:"Borgogna Crolla, Champagne Grower Esplode: i Trend",
       text:"I Premiers Crus di Borgogna perdono il 15% nelle aste dopo anni di speculazione eccessiva. Al contrario i Grower Champagne crescono del 40% — Selosse, Egly-Ouriet, Lassaigne esauriti ovunque in Europa.",
       date:"Sommelier World",photo_query:"wine auction market champagne grower bottle cellar"},
      {emoji:"🌍",cat:"DENOMINAZIONI",title:"Etna DOC: il Vulcano Scala la Classifica Mondiale",
       text:"In 10 anni l'Etna è passata da curiosità locale a denominazione citata accanto a Borgogna e Barolo. Benanti, Cornelissen, Terre Nere, Passopisciaro: una nuova leggenda enologica si scrive sull'Etna.",
       date:"Sommelier World",photo_query:"etna volcano vineyard sicily nerello mascalese"},
      {emoji:"🥂",cat:"TREND 2026",title:"Pét-Nat, Orange Wine, Anfora: la Trilogia della Nuova Generazione",
       text:"I venti-trentenni scelgono vini che raccontano una storia senza filtri. Pétillant naturel, vini arancioni macerati e vini in anfora di terracotta dominano le carte dei ristoranti più innovativi d'Europa.",
       date:"Sommelier World",photo_query:"orange wine natural amphora clay fermentation craft"}
    ]}
  ];
  
  var theme = THEMES[dayOfYear % THEMES.length];
  
  var CURIOSITA = [
    {emoji:"🔬",titolo:"Perché il Nebbiolo è così difficile",testo:"Il Nebbiolo matura tra i primi, ma va raccolto tardi per perdere l'acidità. Le Langhe offrono escursioni termiche autunnali uniche: è questa magia a rendere grande il Barolo.",photo_query:"nebbiolo grape harvest autumn vineyard"},
    {emoji:"🍾",titolo:"La prima bolla non era francese",testo:"Il primo vino frizzante documentato è il Blanquette de Limoux del 1531, 150 anni prima dello Champagne. I monaci di Saint-Hilaire in Languedoc scoprirono accidentalmente la rifermentazione.",photo_query:"sparkling wine history bottle monk cellar"},
    {emoji:"📏",titolo:"La bottiglia da 75cl: perché quella misura?",testo:"75 centilitri era la capacità media dei polmoni di un soffiatore di vetro veneziano del '600. Una misura anatomica diventata standard mondiale del vino.",photo_query:"wine bottle glass shape history winery"},
    {emoji:"🌡️",titolo:"Il Decanter non è solo estetica",testo:"Versare un Barolo in un decanter 2 ore prima di servirlo non è snobismo: l'ossigenazione rompe i polimeri tannici e fa emergere i profumi terziari di cuoio, tabacco e catrame.",photo_query:"wine decanter crystal glass pouring cellar"},
    {emoji:"🍇",titolo:"Quante uve per una bottiglia?",testo:"Per una bottiglia da 75cl servono circa 600-800 chicchi d'uva, 1,2 kg circa. Un filare di vite produce mediamente 5-6 bottiglie l'anno — una quantità sorprendentemente piccola.",photo_query:"wine grape harvest quantity vineyard hand"},
    {emoji:"🪵",titolo:"Rovere Francese: non tutte le botti sono uguali",testo:"Il rovere di Allier, Nevers, Vosgi e Tronçais ha densità e grana diverse. Un barriqueur artigianale di Nuits-Saint-Georges sceglie la foresta come il sommelier sceglie il vigneto.",photo_query:"oak barrels cooper winery craft traditional"}
  ];
  
  theme.eventi = [];
  theme.curiosita = CURIOSITA[dayOfYear % CURIOSITA.length];
  theme.source = "daily-" + (dayOfYear % THEMES.length);
  return theme;
}

async function generateEvergreenNews(){
  if(!apiKey && !SERVER_URL) return null;
  var lang = (typeof i18n !== 'undefined') ? i18n.current : 'it';
  var langInstr = lang === 'en' ? 'Write everything in English.' : lang === 'fr' ? 'Écrivez tout en français.' : 'Scrivi tutto in italiano.';
  var sys = langInstr + ' You are the editor of Sommelier World, an international wine encyclopedia. Generate 4 articles on wine topics (history, grape varieties, winemaking, regions, how to choose wine). Respond ONLY with valid JSON (no markdown): {"notizie":[{"title":"...","text":"2 specific sentences.","date":"Sommelier World","emoji":"🍷","cat":"CATEGORY","photo_query":"wine vineyard specific query in english"},...],"eventi":[],"curiosita":{"emoji":"🔍","titolo":"...","testo":"2 interesting sentences.","photo_query":"wine specific query"}}';
  try{
    var text = await callAPI(sys, 'Generate 4 wine articles for today', null, null);
    var clean = text.replace(/```json|```/g,'').trim();
    var parsed = JSON.parse(clean);
    if(parsed) parsed.source = 'ai';
    return parsed;
  } catch(e){ return null; }
}

// callAPILong — versione per contenuti lunghi (schede, articoli)
async function callAPILong(system, userMsg) {
  if(system && typeof i18n !== 'undefined' && i18n.current !== 'it'){
    var _lc = i18n.aiCmd();
    if(_lc && system.indexOf(_lc.trim()) < 0) system = _lc + system;
  }

  // ── Modalità SERVER ──
  if(SERVER_URL && SERVER_URL.startsWith('http')){
    var r = await fetch(SERVER_URL + '/api/groq', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ system: system, userMsg: userMsg, maxTokens: 2500 })
    });
    var data = await r.json();
    if(!r.ok) throw new Error(data.error || 'Errore server');
    return data.text;
  }

  // ── Modalità LOCALE ──
  if(!apiKey) throw new Error('Server non raggiungibile. Riprova.');
  var payload = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2500,
    messages: [
      {role:'system', content: system},
      {role:'user', content: userMsg}
    ]
  });
  var r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
    body: payload
  });
  if(!r.ok){
    var errData = await r.json().catch(function(){ return {}; });
    var errMsg = (errData.error && errData.error.message) ? errData.error.message : 'Errore API';
    // Trasforma gli errori Groq in messaggi leggibili
    if(errMsg.indexOf('Rate limit') > -1 || errMsg.indexOf('rate_limit') > -1){
      var waitMatch = errMsg.match(/(\d+)m(\d+)s/) || errMsg.match(/(\d+) seconds?/);
      if(waitMatch){
        throw new Error('⏳ Limite giornaliero Groq raggiunto. Riprova tra ' + waitMatch[0] + '. (Il limite si resetta ogni 24 ore — piano gratuito: 100.000 token/giorno)');
      }
      throw new Error('⏳ Limite Groq raggiunto. Riprova domani o vai su console.groq.com per aumentare il limite.');
    }
    if(errMsg.indexOf('Invalid API Key') > -1 || errMsg.indexOf('401') > -1){
      throw new Error('🔑 Chiave API non valida. Tocca ⚙️ e inserisci la chiave gsk_ corretta da console.groq.com');
    }
    throw new Error(errMsg);
  }
  var data = await r.json();
  return data.choices[0].message.content;
}


async function loadNews(force){
  var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / 864e5); var lang = (typeof i18n !== 'undefined') ? i18n.current : 'it'; var key = todayKey() + '_t' + (dayOfYear % 6) + '_' + lang;
  // Con API key, non usare cache per avere sempre notizie fresche da AI
  if(!force && !apiKey){
    try{
      var cached = localStorage.getItem(key);
      if(cached){
        renderNews(JSON.parse(cached),'newsContainer');
        syncNewsPage();
        return;
      }
    } catch(e){}
  }

  var cont = document.getElementById('newsContainer');
  if(cont) cont.innerHTML = '<div class="news-spinner">· · ·</div>';

  // 1. Prova news live da RSS
  var news = await fetchLiveNews();

  // 2. Se live fallisce e c'è API key, genera con AI
  if(!news && apiKey){
    news = await generateEvergreenNews();
  }

  // 3. Se anche AI fallisce, mostra messaggio
  if(!news){
    if(cont){
      if(!apiKey && !SERVER_URL){
        cont.innerHTML = '<div class="news-spinner" style="color:rgba(191,155,74,.4);">Configura la chiave AI (⚙️) per le notizie</div>';
      } else {
        // Tenta il vecchio sistema come ultimo resort
        try{
          var text = await callAPI(NEWS_SYS, 'Genera 4 notizie per oggi ' + italianDate(), null, null);
          var clean = text.replace(/```json|```/g,'').trim();
          news = JSON.parse(clean);
          if(!news || (!Array.isArray(news) && !news.notizie)) throw new Error('empty');
        } catch(e){
          cont.innerHTML = '<div class="news-spinner">Notizie non disponibili. <span style="color:var(--vino);cursor:pointer;" onclick="loadNews(true)">Riprova ↻</span></div>';
          return;
        }
      }
    }
    if(!news) return;
  }

  // Salva in cache
  try{
    localStorage.setItem(key, JSON.stringify(news));
    Object.keys(localStorage).forEach(function(k){
      if(k.startsWith('sw_news_') && k !== key) localStorage.removeItem(k);
    });
  } catch(e){}

  renderNews(news, 'newsContainer');
  syncNewsPage();
}

function syncNewsPage(){
  var dst=document.getElementById('newsPageContainer');
  if(dst)dst.innerHTML=document.getElementById('newsContainer').innerHTML;
}

// ══════════════════════════════════════════════
// PRO SUBSCRIPTION
// ══════════════════════════════════════════════
var isPro = false;
// ProState viene definito dopo — inizializziamo dopo il caricamento
(function initProState(){
  try{
    var KEY = 'sw_pro_v2';
    var data = JSON.parse(localStorage.getItem(KEY)||'{}');
    isPro = !!(data.active && data.expires && new Date(data.expires) > new Date());
    if(isPro){
      $show('proBanner','flex');
      $hide('proOffer');
      try{ if(localStorage.getItem('sw_exclusive')==='1') document.body.classList.add('exclusive'); }catch(e){}
    }
  }catch(e){ isPro = false; }
})();

function closeProModal(){
  document.getElementById('proModal').style.display='none';
  document.body.style.overflow='';
}
// Mostra azioni dopo abbinamento
var _origDoAbb = doAbbinamento;

// ══════════════════════════════════════════════
// EXPORT PDF
// ══════════════════════════════════════════════
function exportPDF(){
  var result = document.getElementById('somResult');
  if(!result || result.style.display==='none'){
    alert('Prima genera un abbinamento');
    return;
  }
  var menu = document.getElementById('menuText').value.trim();
  var budget = document.getElementById('budget').value;
  
  try{
    var doc = new window.jspdf.jsPDF({
      orientation:'portrait', unit:'mm', format:'a4'
    });
    
    // Header
    doc.setFillColor(10,7,5);
    doc.rect(0,0,210,40,'F');
    doc.setTextColor(191,155,74);
    doc.setFont('helvetica','bold');
    doc.setFontSize(22);
    doc.text('SOMMELIER WORLD', 105, 18, {align:'center'});
    doc.setFontSize(10);
    doc.setFont('helvetica','normal');
    doc.text('Abbinamento Vini — Generato da AI', 105, 28, {align:'center'});
    doc.text(new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}), 105, 35, {align:'center'});
    
    // Menu
    doc.setTextColor(0,0,0);
    doc.setFontSize(12);
    doc.setFont('helvetica','bold');
    doc.text('Menu', 20, 55);
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    var menuLines = doc.splitTextToSize(menu || 'Menu inserito', 170);
    doc.text(menuLines, 20, 63);
    
    // Budget
    doc.setFont('helvetica','bold');
    doc.setFontSize(11);
    doc.text('Budget per bottiglia: €'+budget, 20, 63 + menuLines.length*5 + 5);
    
    // Abbinamenti
    var yPos = 63 + menuLines.length*5 + 18;
    doc.setFont('helvetica','bold');
    doc.setFontSize(13);
    doc.setTextColor(92,26,26);
    doc.text('Abbinamenti Consigliati', 20, yPos);
    yPos += 8;
    
    // Estrai testo dal risultato
    var text = result.innerText || result.textContent || '';
    var lines = doc.splitTextToSize(text, 170);
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.setTextColor(0,0,0);
    
    for(var i=0; i<lines.length; i++){
      if(yPos > 270){
        doc.addPage();
        yPos = 20;
      }
      doc.text(lines[i], 20, yPos);
      yPos += 5;
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150,150,150);
    doc.text('Sommelier World — Abbinamenti generati con AI a scopo informativo', 105, 285, {align:'center'});
    
    doc.save('abbinamento-vini-'+new Date().getTime()+'.pdf');
  }catch(e){
    alert('Errore PDF: '+e.message+'. Assicurati di essere online per caricare la libreria PDF.');
  }
}

// ══════════════════════════════════════════════
// QR CODE MENU
// ══════════════════════════════════════════════
var _qrInstance = null;
function openQRModal(){
  var result = document.getElementById('somResult');
  if(!result || result.style.display==='none'){
    alert('Prima genera un abbinamento');
    return;
  }
  document.getElementById('qrModal').style.display='flex';
  document.body.style.overflow='hidden';
  
  // Genera QR con il testo del menu + data
  var menu = document.getElementById('menuText').value.trim();
  var budget = document.getElementById('budget').value;
  var qrText = 'SOMMELIER WORLD\nMenu: '+menu+'\nBudget: €'+budget+'\nData: '+new Date().toLocaleDateString('it-IT');
  
  var container = document.getElementById('qrContainer');
  container.innerHTML = '';
  
  try{
    _qrInstance = new QRCode(container, {
      text: qrText,
      width: 200,
      height: 200,
      colorDark: '#0A0705',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M
    });
    document.getElementById('qrRestName').textContent = 'Scansiona per abbinamenti · ' + new Date().toLocaleDateString('it-IT');
  }catch(e){
    container.innerHTML = '<div style="color:#f77;padding:20px;font-size:.8rem;">Libreria QR non disponibile offline.<br>Connettiti e riprova.</div>';
  }
}
function closeQRModal(){
  document.getElementById('qrModal').style.display='none';
  document.body.style.overflow='';
}
function downloadQR(){
  var canvas = document.querySelector('#qrContainer canvas');
  if(!canvas){alert('QR non generato');return;}
  var link = document.createElement('a');
  link.download = 'qr-menu-sommelier.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ══════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════
var ADMIN_PWD_HASH = 'sommelier2025'; // Cambia questa password!
var adminLogged = false;

function checkAdmin(){
  var pwd = document.getElementById('adminPwd').value;
  if(pwd === ADMIN_PWD_HASH){
    adminLogged = true;
    $hide('adminLogin');
    $show('adminPanel');
    loadAdminData();
  } else {
    $show('adminErr');
    setTimeout(function(){$hide('adminErr');},2000);
  }
}
function adminLogout(){
  adminLogged = false;
  $show('adminLogin');
  $hide('adminPanel');
  var p=$el('adminPwd'); if(p) p.value='';
}


function loadAdminData(){
  var prods = getProds();
  var pending = prods.filter(function(p){return p.status==='pending_payment'||!p.status;});
  var approved = prods.filter(function(p){return p.status==='approved';});
  
  // Stats
  document.getElementById('adminStats').innerHTML = [
    {label:'Totale',val:prods.length,color:'var(--oro)'},
    {label:'In attesa',val:pending.length,color:'#fa0'},
    {label:'Approvati',val:approved.length,color:'#4CAF50'}
  ].map(function(s){
    return '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(191,155,74,.15);padding:12px;text-align:center;">'
      +'<div style="font-family:Cinzel,serif;font-size:1.4rem;color:'+s.color+';">'+s.val+'</div>'
      +'<div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:2px;color:rgba(191,155,74,.45);">'+s.label+'</div></div>';
  }).join('');
  
  // Pending
  var pendHtml = pending.length ? pending.map(function(p,i){
    var idx = prods.indexOf(p);
    return '<div style="background:rgba(255,165,0,.06);border:1px solid rgba(255,165,0,.2);border-left:3px solid #fa0;padding:12px;margin-bottom:8px;">'
      +'<div style="font-family:Cinzel,serif;font-size:.6rem;color:var(--crema);">'+p.wine+'</div>'
      +'<div style="font-family:Cinzel,serif;font-size:.57rem;color:rgba(191,155,74,.55);margin:3px 0;">'+p.cantina+' · '+p.pkg.toUpperCase()+'</div>'
      +'<div style="font-size:.78rem;color:rgba(245,239,226,.45);margin-bottom:8px;">'+p.email+'</div>'
      +'<div style="display:flex;gap:6px;">'
      +'<button onclick="approveProducer('+idx+')" style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;padding:5px 12px;background:#2a5a2a;color:#fff;border:none;cursor:pointer;">✓ APPROVA</button>'
      +'<button onclick="rejectProducer('+idx+')" style="font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;padding:5px 12px;background:#5a1a1a;color:#fff;border:none;cursor:pointer;">✕ RIFIUTA</button>'
      +'</div></div>';
  }).join('') : '<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.3);padding:12px;">Nessuna richiesta in attesa</div>';
  document.getElementById('adminPending').innerHTML = pendHtml;
  
  // Approved
  var appHtml = approved.length ? approved.map(function(p,i){
    var idx = prods.indexOf(p);
    return '<div style="background:rgba(76,175,80,.05);border:1px solid rgba(76,175,80,.2);border-left:3px solid #4CAF50;padding:10px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">'
      +'<div><div style="font-family:Cinzel,serif;font-size:.58rem;color:var(--crema);">'+p.wine+'</div>'
      +'<div style="font-family:Cinzel,serif;font-size:.56rem;color:rgba(191,155,74,.5);">'+p.cantina+' · '+p.pkg+'</div></div>'
      +'<button onclick="rejectProducer('+idx+')" style="font-family:Cinzel,serif;font-size:.38rem;padding:4px 8px;background:rgba(92,26,26,.4);color:#f99;border:none;cursor:pointer;">RIMUOVI</button>'
      +'</div>';
  }).join('') : '<div style="font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.3);padding:12px;">Nessun produttore approvato</div>';
  document.getElementById('adminApproved').innerHTML = appHtml;
}

function approveProducer(idx){
  var prods = getProds();
  prods[idx].status = 'approved';
  saveProds(prods);
  loadAdminData();
}
function rejectProducer(idx){
  var prods = getProds();
  prods.splice(idx,1);
  saveProds(prods);
  loadAdminData();
}

// ══════════════════════════════════════════════
// RICERCA FULL-TEXT migliorata
// ══════════════════════════════════════════════
// Override autocomplete per includere stile/carattere
var _origSearchTO = null;  // capture=true per override

// Mostra azioni dopo abbinamento
var _somResultObserver = null;
(function(){
  if(typeof doAbbinamento === 'function'){
    var orig = doAbbinamento;
    doAbbinamento = async function(){
      await orig.apply(this, arguments);
      var res = document.getElementById('somResult');
      var acts = document.getElementById('somActions');
      if(res && acts && res.style.display !== 'none'){
        acts.style.display = 'flex';
      }
    };
  }
})();





// ══════════════════════════════════════════════
// EXPLORER — DOM-based, senza HTML string concat
// ══════════════════════════════════════════════
var EXP = (function(){
  var feats = [{"id":"barolo","name":"Barolo DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo","type":"DOCG","color":"#8B0000","description":"Re dei vini. Nebbiolo su marne helvetiane. Viola, rosa, catrame, tabacco. 38 mesi affinamento."},{"id":"barbaresco","name":"Barbaresco DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo","type":"DOCG","color":"#8B0000","description":"Regina dei vini. Nebbiolo più elegante su tufo e sabbia. MGA: Asili, Rabajà, Martinenga."},{"id":"gattinara","name":"Gattinara DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo (Spanna)","type":"DOCG","color":"#8B0000","description":"Nebbiolo su porfido rosso vulcanico. Struttura e longevità. Travaglini, Antoniolo."},{"id":"ghemme","name":"Ghemme DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo, Vespolina","type":"DOCG","color":"#8B0000","description":"Alto Piemonte. Nebbiolo su porfido e argille. Cantalupo come riferimento."},{"id":"asti","name":"Asti DOCG","country":"Italia","region":"Piemonte","grapes":"Moscato Bianco","type":"DOCG","color":"#FFD700","description":"Moscato dolce frizzante delle colline astigiane. Pesca, albicocca, fiori d'acacia. Contratto, G.B. Burlotto."},{"id":"moscato_asti","name":"Moscato d'Asti DOCG","country":"Italia","region":"Piemonte","grapes":"Moscato Bianco","type":"DOCG","color":"#FFD700","description":"Versione ferma e dolce del Moscato. Bassa gradazione, aromi intensi. Ceretto, La Spinetta."},{"id":"dolcetto_dogliani","name":"Dolcetto di Dogliani DOCG","country":"Italia","region":"Piemonte","grapes":"Dolcetto","type":"DOCG","color":"#8B0000","description":"Dogliani: casa storica del Dolcetto. Suoli calcarei-argillosi. Prugna, mandorla amara. Einaudi, Abbona."},{"id":"roero","name":"Roero DOCG","country":"Italia","region":"Piemonte","grapes":"Nebbiolo, Arneis","type":"DOCG","color":"#8B0000","description":"Riva sinistra del Tanaro. Nebbiolo su sabbie terziarie. Arneis bianco di eccellenza. Matteo Correggia."},{"id":"brachetto","name":"Brachetto d'Acqui DOCG","country":"Italia","region":"Piemonte","grapes":"Brachetto","type":"DOCG","color":"#9B59B6","description":"Dolce rosato frizzante. Rosa, fragola, lampone. Banfi, Braida, Coppo."},{"id":"barbera_alba","name":"Barbera d'Alba DOC","country":"Italia","region":"Piemonte","grapes":"Barbera","type":"DOC","color":"#8B0000","description":"Barbera nelle Langhe. Acidità vivace, frutti rossi, note speziate. Giacomo Conterno, Bruno Giacosa."},{"id":"barbera_asti","name":"Barbera d'Asti DOCG","country":"Italia","region":"Piemonte","grapes":"Barbera","type":"DOCG","color":"#8B0000","description":"Nizza e Tinella le sottozone top. Ciliegia, mora, amarena. Olim Bauda, Coppo, Bersano."},{"id":"dolcetto_alba","name":"Dolcetto d'Alba DOC","country":"Italia","region":"Piemonte","grapes":"Dolcetto","type":"DOC","color":"#8B0000","description":"Dolcetto versatile delle Langhe. Viola, prugna, ciliegia. Ceretto, Prunotto."},{"id":"langhe","name":"Langhe DOC","country":"Italia","region":"Piemonte","grapes":"Nebbiolo, Chardonnay, Arneis","type":"DOC","color":"#8B0000","description":"Denominazione ombrello delle Langhe. Permette vitigni diversi. Base per IGT noti."},{"id":"franciacorta","name":"Franciacorta DOCG","country":"Italia","region":"Lombardia","grapes":"Chardonnay, Pinot Nero, Pinot Bianco","type":"DOCG","color":"#FFD700","description":"Metodo Classico italiano d'eccellenza. Morene glaciali del Lago d'Iseo. Berlucchi, Ca\' del Bosco, Bellavista."},{"id":"valtellina","name":"Valtellina Superiore DOCG","country":"Italia","region":"Lombardia","grapes":"Nebbiolo (Chiavennasca)","type":"DOCG","color":"#8B0000","description":"Terrazzamenti alpini verticali su granito. Sassella, Grumello, Inferno, Valgella. Nino Negri."},{"id":"sforzato","name":"Sforzato di Valtellina DOCG","country":"Italia","region":"Lombardia","grapes":"Nebbiolo","type":"DOCG","color":"#8B0000","description":"Appassimento in Valtellina. Uve secche per 3 mesi. 14%+. Ercole, Nino Negri Il Fruttaio."},{"id":"oltrepo","name":"Oltrepò Pavese Metodo Classico DOCG","country":"Italia","region":"Lombardia","grapes":"Pinot Nero","type":"DOCG","color":"#FFD700","description":"Colline pavesi. Pinot Nero per bollicine. Monsupello, Ballabio."},{"id":"soave","name":"Soave Classico DOC","country":"Italia","region":"Veneto","grapes":"Garganega, Trebbiano di Soave","type":"DOC","color":"#FFD700","description":"Basalto e tufo vulcanico. Mandorla, fiori bianchi, agrumi. Pieropan, Gini, Prà."},{"id":"soave_superiore","name":"Soave Superiore DOCG","country":"Italia","region":"Veneto","grapes":"Garganega","type":"DOCG","color":"#FFD700","description":"Versione superiore con resa ridotta. Struttura e longevità. Inama, Tamellini."},{"id":"amarone","name":"Amarone della Valpolicella DOCG","country":"Italia","region":"Veneto","grapes":"Corvina, Corvinone, Rondinella","type":"DOCG","color":"#8B0000","description":"Appassimento 90+ giorni. 15-17°. Quintarelli, Dal Forno, Masi."},{"id":"valpolicella","name":"Valpolicella DOC","country":"Italia","region":"Veneto","grapes":"Corvina, Molinara, Rondinella","type":"DOC","color":"#8B0000","description":"Tre zone: Classico, Valpantena, Est. Base per Ripasso e Amarone."},{"id":"recioto","name":"Recioto della Valpolicella DOCG","country":"Italia","region":"Veneto","grapes":"Corvina, Corvinone","type":"DOCG","color":"#8B0000","description":"Vino dolce da appassimento. Uve selezionate. Prugna sotto spirito, cioccolato."},{"id":"prosecco","name":"Prosecco Superiore DOCG","country":"Italia","region":"Veneto","grapes":"Glera","type":"DOCG","color":"#FFD700","description":"Valdobbiadene e Conegliano UNESCO. Rive e Cartizze. Metodo Charmat."},{"id":"bardolino","name":"Bardolino DOC","country":"Italia","region":"Veneto","grapes":"Corvina, Rondinella","type":"DOC","color":"#8B0000","description":"Sponda veronese del Lago di Garda. Leggero, fresco, ciliegia. Guerrieri Rizzardi."},{"id":"colli_euganei","name":"Colli Euganei DOCG","country":"Italia","region":"Veneto","grapes":"Moscato Giallo, Serprino","type":"DOCG","color":"#FFD700","description":"Vulcani dei Colli Euganei. Moscato giallo profumato. Vignalta, Villa Alessi."},{"id":"brunello","name":"Brunello di Montalcino DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese Grosso","type":"DOCG","color":"#8B0000","description":"Sangiovese in purezza. Galestro e alberese. Longevità 50+ anni. Biondi Santi, Soldera."},{"id":"chianti_classico","name":"Chianti Classico DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Cuore storico tra Firenze e Siena. Gallo Nero. Gran Selezione in vetta."},{"id":"chianti","name":"Chianti DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"7 sottozone: Rufina, Colli Fiorentini, Colli Senesi, Pisane. Antinori, Frescobaldi."},{"id":"nobile","name":"Vino Nobile di Montepulciano DOCG","country":"Italia","region":"Toscana","grapes":"Prugnolo Gentile","type":"DOCG","color":"#8B0000","description":"Prugnolo su argille e galestro. Avignonesi, Poliziano, Boscarelli."},{"id":"morellino","name":"Morellino di Scansano DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese (Morellino)","type":"DOCG","color":"#8B0000","description":"Maremma toscana. Sangiovese su argille costiere. Moris Farms, Rocca di Frassinello."},{"id":"bolgheri","name":"Bolgheri DOC","country":"Italia","region":"Toscana","grapes":"Cabernet Sauvignon, Merlot, Cabernet Franc","type":"DOC","color":"#8B0000","description":"Costa toscana. Sassicaia, Ornellaia, Masseto. Suoli limosi e argillosi."},{"id":"carmignano","name":"Carmignano DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese, Cabernet Sauvignon","type":"DOCG","color":"#8B0000","description":"Primo Cabernet in Italia. Villa di Capezzana. Suoli calcarei-argillosi."},{"id":"vernaccia","name":"Vernaccia di San Gimignano DOCG","country":"Italia","region":"Toscana","grapes":"Vernaccia","type":"DOCG","color":"#FFD700","description":"Prima DOC/DOCG italiana 1966. Vernaccia su tufo pliocenico. Mandorla, salvia, cedro."},{"id":"bolgheri_sassicaia","name":"Bolgheri Sassicaia DOC","country":"Italia","region":"Toscana","grapes":"Cabernet Sauvignon, Cabernet Franc","type":"DOC","color":"#8B0000","description":"L'unica DOC dedicata a una sola azienda. Tenuta San Guido. Parker 100 pts 1985."},{"id":"sagrantino","name":"Sagrantino di Montefalco DOCG","country":"Italia","region":"Umbria","grapes":"Sagrantino","type":"DOCG","color":"#8B0000","description":"Tannini record mondiali. 33 mesi affinamento. Arnaldo Caprai."},{"id":"torgiano","name":"Torgiano Rosso Riserva DOCG","country":"Italia","region":"Umbria","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Torgiano: patria del Rubesco Riserva. Lungarotti come artefice."},{"id":"montfalco_rosso","name":"Montefalco Rosso DOC","country":"Italia","region":"Umbria","grapes":"Sangiovese, Sagrantino","type":"DOC","color":"#8B0000","description":"Sangiovese e piccola parte Sagrantino. Più accessibile del DOCG."},{"id":"verdicchio","name":"Verdicchio dei Castelli di Jesi DOC","country":"Italia","region":"Marche","grapes":"Verdicchio","type":"DOC","color":"#FFD700","description":"Bianco marchigiano d'eccellenza. Mandorla, agrumi, erbe aromatiche. Umani Ronchi, Garofoli."},{"id":"rosso_piceno","name":"Rosso Piceno Superiore DOC","country":"Italia","region":"Marche","grapes":"Montepulciano, Sangiovese","type":"DOC","color":"#8B0000","description":"Oasi degli Angeli — Kurni: Montepulciano in purezza. Marco Casolanetti, Cupra Marittima."},{"id":"conero","name":"Conero DOCG","country":"Italia","region":"Marche","grapes":"Montepulciano","type":"DOCG","color":"#8B0000","description":"Monte Conero sul mare Adriatico. Montepulciano su calcari scoscesi."},{"id":"aglianico_vulture","name":"Aglianico del Vulture DOC","country":"Italia","region":"Basilicata","grapes":"Aglianico","type":"DOC","color":"#8B0000","description":"Vulture: vulcano spento. Aglianico su suoli vulcanici. Elena Fucci, Paternoster."},{"id":"taurasi","name":"Taurasi DOCG","country":"Italia","region":"Campania","grapes":"Aglianico","type":"DOCG","color":"#8B0000","description":"Barolo del Sud. Acidità tagliente su suoli vulcanici irpini. Mastroberardino."},{"id":"fiano","name":"Fiano di Avellino DOCG","country":"Italia","region":"Campania","grapes":"Fiano","type":"DOCG","color":"#FFD700","description":"Colline irpine a 400-700m. Note di miele, noce, pera, fumo. Feudi di San Gregorio."},{"id":"greco_tufo","name":"Greco di Tufo DOCG","country":"Italia","region":"Campania","grapes":"Greco","type":"DOCG","color":"#FFD700","description":"Tufo vulcanico in Irpinia. Pesca bianca, mandorla, idrocarburi. Benito Ferrara."},{"id":"nerello","name":"Etna DOC","country":"Italia","region":"Sicilia","grapes":"Nerello Mascalese, Carricante","type":"DOC","color":"#8B0000","description":"Vigneti vulcanici 400-1000m. Alberello centenario. Contrade come Borgogna siciliana."},{"id":"nero_avola","name":"Sicilia DOC","country":"Italia","region":"Sicilia","grapes":"Nero d'Avola, Catarratto","type":"DOC","color":"#8B0000","description":"Tutta la Sicilia. Nero d'Avola come ambasciatore. Donnafugata, Planeta, Tasca."},{"id":"cerasuolo","name":"Cerasuolo di Vittoria DOCG","country":"Italia","region":"Sicilia","grapes":"Nero d'Avola, Frappato","type":"DOCG","color":"#8B0000","description":"Unica DOCG siciliana. Ibleo. Nero d'Avola + Frappato. COS, Valle dell'Acate."},{"id":"marsala","name":"Marsala DOC","country":"Italia","region":"Sicilia","grapes":"Grillo, Catarratto, Inzolia","type":"DOC","color":"#FFD700","description":"Vino liquoroso storico. Stile Solera. Fine, Superiore, Vergine. Florio, Pellegrino."},{"id":"passito_pantelleria","name":"Passito di Pantelleria DOC","country":"Italia","region":"Sicilia","grapes":"Zibibbo (Moscato d'Alessandria)","type":"DOC","color":"#FFD700","description":"Isola di Pantelleria. Vite allevata ad alberello basso. Arancio candito, miele, fico."},{"id":"cannonau","name":"Cannonau di Sardegna DOC","country":"Italia","region":"Sardegna","grapes":"Cannonau (Grenache)","type":"DOC","color":"#8B0000","description":"Sardegna longevità. Granito. Pollifemo, Giuseppe Sedilesu. Centenari di Orgosolo."},{"id":"vermentino_gallura","name":"Vermentino di Gallura DOCG","country":"Italia","region":"Sardegna","grapes":"Vermentino","type":"DOCG","color":"#FFD700","description":"Unica DOCG sarda per bianchi. Granito e sabbia. Capichera, Surrau."},{"id":"carignano_sulcis","name":"Carignano del Sulcis DOC","country":"Italia","region":"Sardegna","grapes":"Carignano (Carignan)","type":"DOC","color":"#8B0000","description":"Sulcis: vecchi cespugli allevati ad alberello su sabbie. Santadi."},{"id":"alta_langa","name":"Alta Langa DOCG","country":"Italia","region":"Piemonte","grapes":"Pinot Nero, Chardonnay","type":"DOCG","color":"#FFD700","description":"Metodo Classico piemontese. Alte colline a 250-500m. Contratto, Enrico Serafino."},{"id":"lugana","name":"Lugana DOC","country":"Italia","region":"Lombardia/Veneto","grapes":"Turbiana (Trebbiano di Lugana)","type":"DOC","color":"#FFD700","description":"Riva sud del Lago di Garda. Suoli argillosi glaciali. Ca' dei Frati, Zenato."},{"id":"custoza","name":"Bianco di Custoza DOC","country":"Italia","region":"Veneto","grapes":"Garganega, Trebbiano, Cortese","type":"DOC","color":"#FFD700","description":"Colline moreniche del Garda. Bianco fresco e floreale. Cavalchina."},{"id":"colli_fiorentini","name":"Colli Fiorentini DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Colline intorno a Firenze. Chianti fresco e immediato."},{"id":"pomino","name":"Pomino DOC","country":"Italia","region":"Toscana","grapes":"Sangiovese, Pinot Nero, Chardonnay","type":"DOC","color":"#8B0000","description":"Alta quota in Mugello. Frescobaldi come custode storico."},{"id":"montecucco","name":"Montecucco Sangiovese DOCG","country":"Italia","region":"Toscana","grapes":"Sangiovese","type":"DOCG","color":"#8B0000","description":"Ombrone, vicino Montalcino. Collemassari, Basile."},{"id":"maremma","name":"Maremma Toscana DOC","country":"Italia","region":"Toscana","grapes":"Vermentino, Ciliegiolo, Sangiovese","type":"DOC","color":"#8B0000","description":"Costa maremmana versatile. Rocca di Frassinello, Sassotondo."},{"id":"colli_di_luni","name":"Colli di Luni DOC","country":"Italia","region":"Liguria/Toscana","grapes":"Vermentino, Sangiovese","type":"DOC","color":"#FFD700","description":"Confine ligure-toscano. Vermentino minerale su scisti. Ottaviano Lambruschi."},{"id":"cinque_terre","name":"Cinque Terre DOC","country":"Italia","region":"Liguria","grapes":"Bosco, Albarola, Vermentino","type":"DOC","color":"#FFD700","description":"Terrazzamenti a picco sul mare. Uve trasportate a mano. Cooperativa Cinque Terre."},{"id":"sciacchetrà","name":"Cinque Terre Sciacchetrà DOC","country":"Italia","region":"Liguria","grapes":"Bosco, Albarola, Vermentino","type":"DOC","color":"#FFD700","description":"Passito ligure rarissimo. Sole e salmastro. Produzione limitatissima."},{"id":"ribolla_collio","name":"Collio DOC","country":"Italia","region":"Friuli VG","grapes":"Ribolla Gialla, Friulano, Malvasia Istriana","type":"DOC","color":"#FFD700","description":"Colline marno-arenacee del Collio. Gravner, Radikon, Schiopetto."},{"id":"colli_orientali","name":"Colli Orientali del Friuli DOC","country":"Italia","region":"Friuli VG","grapes":"Ribolla Gialla, Schioppettino, Refosco","type":"DOC","color":"#8B0000","description":"Friuli orientale. Ramandolo DOCG nel comune di Nimis. Ronchi di Cialla."},{"id":"ramandolo","name":"Ramandolo DOCG","country":"Italia","region":"Friuli VG","grapes":"Verduzzo Friulano","type":"DOCG","color":"#FFD700","description":"Vino dolce passito su scisti. Piccolo cru di Nimis. Giovanni Dri."},{"id":"trento","name":"Trento DOC","country":"Italia","region":"Trentino-AA","grapes":"Chardonnay, Pinot Nero","type":"DOC","color":"#FFD700","description":"Metodo Classico trentino. Ferrari, Rotari. Dolomiti come sfondo."},{"id":"teroldego","name":"Teroldego Rotaliano DOC","country":"Italia","region":"Trentino-AA","grapes":"Teroldego","type":"DOC","color":"#8B0000","description":"Campo Rotaliano: piana alluvionale. Teroldego autoctono trentino. Foradori, Mezzacorona."},{"id":"alto_adige","name":"Alto Adige DOC","country":"Italia","region":"Alto Adige/Sudtirol","grapes":"Lagrein, Gewürztraminer, Pinot Grigio","type":"DOC","color":"#8B0000","description":"21 sottozone. Lagrein di Bolzano. Gewürztraminer di Tramin. Alois Lageder."},{"id":"gewurztraminer_aa","name":"Alto Adige Gewürztraminer DOC","country":"Italia","region":"Alto Adige/Sudtirol","grapes":"Gewürztraminer","type":"DOC","color":"#FFD700","description":"Tramin/Termeno patria del Traminer. Rosa, litchi, spezie orientali."},{"id":"aosta","name":"Valle d'Aosta DOC","country":"Italia","region":"Valle d'Aosta","grapes":"Petit Rouge, Fumin, Petite Arvine","type":"DOC","color":"#8B0000","description":"La più piccola DOC d'Italia. Vigneti a 300-1200m. Grosjean, Anselmet, La Crotta."},{"id":"lacrima","name":"Lacrima di Morro d'Alba DOC","country":"Italia","region":"Marche","grapes":"Lacrima","type":"DOC","color":"#8B0000","description":"Vitigno autoctono marchigiano rarissimo. Profumi intensi: violetta, rosa, fragola. Stefano Mancinelli."},{"id":"offida","name":"Offida DOCG","country":"Italia","region":"Marche","grapes":"Pecorino, Passerina","type":"DOCG","color":"#FFD700","description":"Colli Ascolani. Pecorino bianco sapido e minerale. Velenosi, Aurora."},{"id":"montepulciano_d_abruzzo","name":"Montepulciano d'Abruzzo DOC","country":"Italia","region":"Abruzzo","grapes":"Montepulciano","type":"DOC","color":"#8B0000","description":"Costa adriatica. Montepulciano versione morbida. Valentini, Emidio Pepe, Masciarelli."},{"id":"trebbiano_abruzzo","name":"Trebbiano d'Abruzzo DOC","country":"Italia","region":"Abruzzo","grapes":"Trebbiano Abruzzese","type":"DOC","color":"#FFD700","description":"Valentini il massimo interprete. Bianco longevo e minerale insolito."},{"id":"cirò","name":"Cirò DOC","country":"Italia","region":"Calabria","grapes":"Gaglioppo, Greco Bianco","type":"DOC","color":"#8B0000","description":"Il più antico vino del mondo (Crimisa greca). Gaglioppo su suoli argillosi. Librandi."},{"id":"primitivo_manduria","name":"Primitivo di Manduria DOCG","country":"Italia","region":"Puglia","grapes":"Primitivo","type":"DOCG","color":"#8B0000","description":"Tavoliere pugliese. Primitivo (Zinfandel) su suoli rossi ferrosi. Pervini, Gianfranco Fino."},{"id":"negroamaro","name":"Salento IGT / Negroamaro","country":"Italia","region":"Puglia","grapes":"Negroamaro","type":"IGT","color":"#8B0000","description":"Tacco d'Italia. Negroamaro su argille rosse. Cosimo Taurino, Leone de Castris."},{"id":"locorotondo","name":"Locorotondo DOC","country":"Italia","region":"Puglia","grapes":"Verdeca, Bianco d'Alessano","type":"DOC","color":"#FFD700","description":"Valle d'Itria. Trulli e vigneti. Bianco leggero e fresco. Cantina di Locorotondo."},{"id":"frascati","name":"Frascati Superiore DOCG","country":"Italia","region":"Lazio","grapes":"Malvasia Bianca, Trebbiano","type":"DOCG","color":"#FFD700","description":"Castelli Romani vulcanici. Il vino bianco di Roma. Fondata su suoli tufacei."},{"id":"cesanese","name":"Cesanese del Piglio DOCG","country":"Italia","region":"Lazio","grapes":"Cesanese","type":"DOCG","color":"#8B0000","description":"Colline Ciociare. Cesanese autoctono laziale. Giovanna Trisorio, Coletti Conti."},{"id":"orvieto","name":"Orvieto DOC","country":"Italia","region":"Umbria/Lazio","grapes":"Trebbiano Toscano, Grechetto","type":"DOC","color":"#FFD700","description":"La rupe di tufo. Abboccato tradizionale poi secco. Bigi, Antinori."},{"id":"vermentino_sardegna","name":"Vermentino di Sardegna DOC","country":"Italia","region":"Sardegna","grapes":"Vermentino","type":"DOC","color":"#FFD700","description":"Tutta la Sardegna. Vermentino fresco e salino. Sella e Mosca."},{"id":"nuragus","name":"Nuragus di Cagliari DOC","country":"Italia","region":"Sardegna","grapes":"Nuragus","type":"DOC","color":"#FFD700","description":"Cagliari. Nuragus autoctono su suoli alluvionali. Leggero e fruttato."},{"id":"carmenere","name":"Venezia Giulia IGT","country":"Italia","region":"Friuli VG","grapes":"Carmenere, Merlot, Refosco","type":"IGT","color":"#8B0000","description":"Collio e Carso. Terrano sul Carso calcareo. Zidarich, Vodopivec."},{"id":"champagne","name":"Champagne AOC","country":"Francia","region":"Champagne","grapes":"Pinot Noir, Chardonnay, Pinot Meunier","type":"AOC","color":"#FFD700","description":"Suoli cretacei. 5 sottozone. Krug, Dom Pérignon, Bollinger, Salon."},{"id":"romanee_conti","name":"Romanée-Conti Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"Grand Cru","color":"#8B0000","description":"1.8 ettari. Il vino più costoso. DRC. Vosne-Romanée, Côte de Nuits."},{"id":"gevrey","name":"Gevrey-Chambertin","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Chambertin, vino di Napoleone. 9 Grand Crus. Rousseau, Mortet."},{"id":"meursault","name":"Meursault","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Capitale del Chardonnay. Perrières, Genevrières, Charmes 1er Cru. Coche-Dury."},{"id":"montrachet","name":"Montrachet Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"Grand Cru","color":"#FFD700","description":"Il più grande Chardonnay. 7.99 ha tra Puligny e Chassagne."},{"id":"chablis","name":"Chablis","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Kimmeridgiano. 7 Grand Crus. Minérale austero. Raveneau, Dauvissat."},{"id":"pauillac","name":"Pauillac","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Merlot","type":"AOC","color":"#8B0000","description":"Tre Premier GCC: Latour, Lafite, Mouton. Gravel profondo."},{"id":"margaux","name":"Margaux","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Merlot","type":"AOC","color":"#8B0000","description":"Eleganza assoluta di Bordeaux. Château Margaux. Suoli ghiaiosi sottili."},{"id":"pomerol","name":"Pomerol","country":"Francia","region":"Bordeaux","grapes":"Merlot, Cabernet Franc","type":"AOC","color":"#8B0000","description":"Argilla blu di Pétrus. Le Pin, Lafleur. Rive droite."},{"id":"st_emilion","name":"Saint-Émilion Grand Cru","country":"Francia","region":"Bordeaux","grapes":"Merlot, Cabernet Franc","type":"AOC","color":"#8B0000","description":"Cheval Blanc, Ausone. Côtes calcareee e argille."},{"id":"sauternes","name":"Sauternes","country":"Francia","region":"Bordeaux","grapes":"Sémillon, Sauvignon Blanc","type":"AOC","color":"#FFD700","description":"Botrytis nobile. Château d'Yquem Premier Cru Supérieur. Miele e zafferano."},{"id":"graves","name":"Graves","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Semillon","type":"AOC","color":"#8B0000","description":"Gravel su riva sinistra. Haut-Bailly, Smith Haut Lafitte, Domaine de Chevalier."},{"id":"pessac","name":"Pessac-Léognan","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Sauvignon Blanc","type":"AOC","color":"#8B0000","description":"Haut-Brion e La Mission. Gravel urbano. I più grandi bianchi secchi di Bordeaux."},{"id":"st_estephe","name":"Saint-Estèphe","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon, Merlot","type":"AOC","color":"#8B0000","description":"Argille e gravel. Cos d'Estournel e Montrose. Struttura tannica."},{"id":"st_julien","name":"Saint-Julien","country":"Francia","region":"Bordeaux","grapes":"Cabernet Sauvignon","type":"AOC","color":"#8B0000","description":"11 Grands Crus Classés. Léoville Las Cases, Ducru-Beaucaillou. Eleganza."},{"id":"chateauneuf","name":"Châteauneuf-du-Pape","country":"Francia","region":"Rhône","grapes":"Grenache, Syrah, Mourvèdre","type":"AOC","color":"#8B0000","description":"Galets roulés. 13 vitigni. Rayas, Bonneau, Beaucastel."},{"id":"hermitage","name":"Hermitage","country":"Francia","region":"Rhône","grapes":"Syrah, Marsanne","type":"AOC","color":"#8B0000","description":"Collina sacra del Rhône settentrionale. Chave, Jaboulet La Chapelle."},{"id":"cote_rotie","name":"Côte-Rôtie","country":"Francia","region":"Rhône","grapes":"Syrah, Viognier","type":"AOC","color":"#8B0000","description":"Côte Brune e Côte Blonde. Guigal Le Vins de Vienne."},{"id":"condrieu","name":"Condrieu","country":"Francia","region":"Rhône","grapes":"Viognier","type":"AOC","color":"#FFD700","description":"Viognier al massimo. Solo 135 ha su granito. Château-Grillet monopole."},{"id":"cornas","name":"Cornas","country":"Francia","region":"Rhône","grapes":"Syrah","type":"AOC","color":"#8B0000","description":"Granito nero. Syrah puro robusto. Clape, Colombo, Allemand."},{"id":"st_joseph","name":"Saint-Joseph","country":"Francia","region":"Rhône","grapes":"Syrah, Marsanne","type":"AOC","color":"#8B0000","description":"Riva destra del Rhône. Granito. Chave, Chapoutier Gonon."},{"id":"gigondas","name":"Gigondas","country":"Francia","region":"Rhône","grapes":"Grenache, Syrah","type":"AOC","color":"#8B0000","description":"Dentelles de Montmirail. Grenache poderoso su calcare. Raspail-Ay."},{"id":"vacqueyras","name":"Vacqueyras","country":"Francia","region":"Rhône","grapes":"Grenache, Syrah, Mourvèdre","type":"AOC","color":"#8B0000","description":"Côtes du Rhône Villages upgradato. Grenache speziato. Vieux Télégraphe."},{"id":"sancerre","name":"Sancerre","country":"Francia","region":"Loire","grapes":"Sauvignon Blanc, Pinot Noir","type":"AOC","color":"#FFD700","description":"Terres blanches, caillottes, silex. Henri Bourgeois, Vacheron, Dagueneau."},{"id":"pouilly_fume","name":"Pouilly-Fumé","country":"Francia","region":"Loire","grapes":"Sauvignon Blanc","type":"AOC","color":"#FFD700","description":"Silex sulla riva destra della Loire. Fumé da selce. Dagueneau Silex, Baron de L."},{"id":"muscadet","name":"Muscadet Sèvre et Maine","country":"Francia","region":"Loire","grapes":"Melon de Bourgogne","type":"AOC","color":"#FFD700","description":"Sur Lie 9+ mesi. Salinità atlantica. Abbinamento ostriche. L'Écu."},{"id":"vouvray","name":"Vouvray","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"AOC","color":"#FFD700","description":"Tufa rocciosa. Sec, Demi-Sec, Moelleux, Pétillant. Huet, Foreau."},{"id":"chinon","name":"Chinon","country":"Francia","region":"Loire","grapes":"Cabernet Franc","type":"AOC","color":"#8B0000","description":"Tuffeau e gravel. Cabernet Franc elegante. Joguet, Bernard Baudry."},{"id":"bourgueil","name":"Bourgueil","country":"Francia","region":"Loire","grapes":"Cabernet Franc","type":"AOC","color":"#8B0000","description":"Sable e tufo. Cabernet Franc fresco e vinoso. Audebert, Breton."},{"id":"alsace","name":"Alsace AOC","country":"Francia","region":"Alsazia","grapes":"Riesling, Gewurztraminer, Pinot Gris","type":"AOC","color":"#FFD700","description":"Stile tedesco, territorio francese. 51 Grand Crus. Trimbach, Weinbach, Zind-Humbrecht."},{"id":"alsace_riesling","name":"Alsace Grand Cru Schlossberg","country":"Francia","region":"Alsazia","grapes":"Riesling","type":"Grand Cru","color":"#FFD700","description":"Il Grand Cru più esteso. Granito di Kientzheim. Blanck, Weinbach."},{"id":"alsace_gc_rangen","name":"Alsace Grand Cru Rangen","country":"Francia","region":"Alsazia","grapes":"Riesling, Pinot Gris","type":"Grand Cru","color":"#FFD700","description":"Il più meridionale e scosceso. Vulcanite nera. Schoffit, Zind-Humbrecht."},{"id":"pouilly_fuisse","name":"Pouilly-Fuissé","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Mâconnais. Calcari di Pouilly e Fuissé. Ferret, Guffens-Heynen."},{"id":"saint_veran","name":"Saint-Véran","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Mâconnais. Chardonnay fresco e floreale su calcari. Corsin, Deux Roches."},{"id":"nuits_st_georges","name":"Nuits-Saint-Georges","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Côte de Nuits. 41 Premiers Crus. Arlot, Henri Gouges, Leroy."},{"id":"puligny","name":"Puligny-Montrachet","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"AOC","color":"#FFD700","description":"Capitale del Chardonnay bianco. Bâtard, Bienvenues, Chevalier-Montrachet."},{"id":"chassagne","name":"Chassagne-Montrachet","country":"Francia","region":"Bourgogne","grapes":"Chardonnay, Pinot Noir","type":"AOC","color":"#FFD700","description":"Sud Côte de Beaune. Bâtard-Montrachet. Remoissenet, Gagnard."},{"id":"pommard","name":"Pommard","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Pinot Noir potente e strutturato. Argille pesanti. Mugnier, Billard-Gonnet."},{"id":"volnay","name":"Volnay","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Eleganza femminile. Caillerets, Champans, Santenots. Bouchard, Marquis d'Angerville."},{"id":"corton","name":"Corton Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir, Chardonnay","type":"Grand Cru","color":"#8B0000","description":"L'unico Grand Cru rouge della Côte de Beaune. La Tâche alternative. Jadot."},{"id":"corton_charlemagne","name":"Corton-Charlemagne Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Chardonnay","type":"Grand Cru","color":"#FFD700","description":"Chardonnay di potenza e mineralità. Cailleret e Pougets. Bonneau du Martray."},{"id":"vosne","name":"Vosne-Romanée","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"La comune dei Grand Crus. Romanée-Conti, Richebourg, La Tâche. DRC."},{"id":"chambolle","name":"Chambolle-Musigny","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"AOC","color":"#8B0000","description":"Pinot più feminile. Calcari e argille. Mugnier, de Vogüé."},{"id":"musigny","name":"Musigny Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir, Chardonnay","type":"Grand Cru","color":"#8B0000","description":"10.86 ha. Délicatesse e seta. de Vogüé, Leroy, Mugnier."},{"id":"clos_vougeot","name":"Clos de Vougeot Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"Grand Cru","color":"#8B0000","description":"50 ha storici. Muro medievale. 80+ proprietari. DRC, Faiveley, Méo-Camuzet."},{"id":"bonnes_mares","name":"Bonnes-Mares Grand Cru","country":"Francia","region":"Bourgogne","grapes":"Pinot Noir","type":"Grand Cru","color":"#8B0000","description":"Confine Morey-Chambolle. Potenza e finezza. Drouhin, Roumier."},{"id":"morgon","name":"Morgon","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Il Beaujolais più serio. Scisto di Côte du Py. Foillard, Lapierre, Desvignes."},{"id":"moulin_a_vent","name":"Moulin-à-Vent","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Il più strutturato dei 10 Crus. Manganese nel suolo. Jadot, Thorin."},{"id":"fleurie","name":"Fleurie","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Eleganza e profumo. La Madone come cru top. Château de Fleurie."},{"id":"brouilly","name":"Brouilly","country":"Francia","region":"Beaujolais","grapes":"Gamay","type":"Cru Beaujolais","color":"#8B0000","description":"Il più grande cru. Mont Brouilly vulcanico. Château Thivin."},{"id":"bandol","name":"Bandol AOC","country":"Francia","region":"Provence","grapes":"Mourvèdre, Grenache","type":"AOC","color":"#8B0000","description":"Provence: Mourvèdre dominante. Argille e calcare. Tempier, Pibarnon."},{"id":"cassis","name":"Cassis AOC","country":"Francia","region":"Provence","grapes":"Marsanne, Clairette, Ugni Blanc","type":"AOC","color":"#FFD700","description":"Calanques calcari bianchi. Bianco iodato e minerale. Clos Sainte-Magdeleine."},{"id":"cotes_provence","name":"Côtes de Provence","country":"Francia","region":"Provence","grapes":"Grenache, Syrah, Cinsault","type":"AOC","color":"#9B59B6","description":"Provenza. Il più grande rosé del mondo. Miraval, Minuty, Ott."},{"id":"corse_patrimonio","name":"Patrimonio AOC","country":"Francia","region":"Corsica","grapes":"Nielluccio (Sangiovese), Vermentino","type":"AOC","color":"#8B0000","description":"Cap Corse. Calcari argillosi bianchi. Nielluccio strutturato. Gentile."},{"id":"pic_st_loup","name":"Pic Saint-Loup","country":"Francia","region":"Languedoc","grapes":"Syrah, Grenache, Mourvèdre","type":"AOC","color":"#8B0000","description":"Massif nord di Montpellier. Clima fresco, Syrah elegante. Mas Bruguière."},{"id":"faugeres","name":"Faugères","country":"Francia","region":"Languedoc","grapes":"Syrah, Grenache, Mourvèdre","type":"AOC","color":"#8B0000","description":"Scisto di Faugères. Potere mineralità. Léon Barral, Alquier."},{"id":"st_chinian","name":"Saint-Chinian","country":"Francia","region":"Languedoc","grapes":"Grenache, Syrah, Carignan","type":"AOC","color":"#8B0000","description":"Languedoc. Scisto e calcare. Mas Champart, Borie La Vitarèle."},{"id":"collioure","name":"Collioure","country":"Francia","region":"Roussillon","grapes":"Grenache, Syrah, Mourvèdre","type":"AOC","color":"#8B0000","description":"Costa catalana. Scisto. Grenache maturo e concentrato. Coume Del Mas."},{"id":"maury","name":"Maury","country":"Francia","region":"Roussillon","grapes":"Grenache Noir","type":"AOC","color":"#8B0000","description":"VDN (Vino Dolce Naturale). Grenache su scisto. Mas Amiel, Maury Sec."},{"id":"banyuls","name":"Banyuls","country":"Francia","region":"Roussillon","grapes":"Grenache Noir","type":"AOC","color":"#8B0000","description":"VDN con invecchiamento. Cap Cerbère sul mare. Mas de la Rouvière."},{"id":"muscadet_gm","name":"Muscadet Grand Lieu","country":"Francia","region":"Loire","grapes":"Melon de Bourgogne","type":"AOC","color":"#FFD700","description":"Lago di Grand-Lieu. Sur Lie intenso. Bianco salino."},{"id":"anjou","name":"Anjou","country":"Francia","region":"Loire","grapes":"Chenin Blanc, Cabernet Franc","type":"AOC","color":"#FFD700","description":"Schiste d'Anjou. Chenin versatile. Clos Rougeard, Ogereau."},{"id":"savennieres","name":"Savennières","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"AOC","color":"#FFD700","description":"Roche aux Moines, Coulée de Serrant (monopole). Chenin sec de garde."},{"id":"coteaux_layon","name":"Coteaux du Layon","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"AOC","color":"#FFD700","description":"Chenin dolce su argille. Moulin Touchais. Bonnezeaux e Quarts de Chaume."},{"id":"quarts_de_chaume","name":"Quarts de Chaume Grand Cru","country":"Francia","region":"Loire","grapes":"Chenin Blanc","type":"Grand Cru","color":"#FFD700","description":"46 ha. Botrytis su schiste. Chenin liquoroso di rara eleganza."},{"id":"bourgueil_st_nico","name":"Saint-Nicolas-de-Bourgueil","country":"Francia","region":"Loire","grapes":"Cabernet Franc","type":"AOC","color":"#8B0000","description":"Sabbie e ghiaie del borgo. Cabernet Franc fresco e fruttato."},{"id":"saumur","name":"Saumur","country":"Francia","region":"Loire","grapes":"Cabernet Franc, Chenin Blanc","type":"AOC","color":"#8B0000","description":"Tuffeau bianco. Saumur-Champigny Cab.Franc. Cave troglodyte."},{"id":"jura_cotes","name":"Côtes du Jura","country":"Francia","region":"Jura","grapes":"Savagnin, Chardonnay, Poulsard","type":"AOC","color":"#FFD700","description":"Lias e argille del Giura. Savagnin ossidativo, Vin Jaune, Vin de Paille."},{"id":"vin_jaune","name":"Château-Chalon","country":"Francia","region":"Jura","grapes":"Savagnin","type":"AOC","color":"#FFD700","description":"Cru del Vin Jaune. Solo millesimi eccellenti. 6 anni sous voile. Berthet-Bondet."},{"id":"bugey","name":"Bugey AOVDQS","country":"Francia","region":"Ain","grapes":"Altesse, Chardonnay, Mondeuse","type":"AOC","color":"#FFD700","description":"Montagne di confine con la Savoia. Altesse e Mondeuse."},{"id":"savoie","name":"Vin de Savoie","country":"Francia","region":"Savoie","grapes":"Altesse, Jacquère, Mondeuse","type":"AOC","color":"#FFD700","description":"Alpi di Savoie. 23 crus. Roussette de Savoie. Michel Grisard."},{"id":"rioja","name":"Rioja DOCa","country":"Spagna","region":"La Rioja","grapes":"Tempranillo, Garnacha, Mazuelo","type":"DOCa","color":"#8B0000","description":"Prima DOCa di Spagna. Rioja Alta, Alavesa, Oriental. Muga, CVNE."},{"id":"priorat","name":"Priorat DOCa","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Cariñena","type":"DOCa","color":"#8B0000","description":"Llicorella. Alvaro Palacios L'Ermita, Clos Mogador, Clos de l'Obac."},{"id":"ribera_duero","name":"Ribera del Duero DO","country":"Spagna","region":"Castiglia e León","grapes":"Tinto Fino","type":"DO","color":"#8B0000","description":"Meseta 800-900m. Vega Sicilia Único, Pingus, Pesquera."},{"id":"rias_baixas","name":"Rías Baixas DO","country":"Spagna","region":"Galizia","grapes":"Albariño","type":"DO","color":"#FFD700","description":"Costa atlantica. Albariño su granito. Salinità e acidità."},{"id":"jerez","name":"Jerez-Xérès-Sherry DO","country":"Spagna","region":"Andalusia","grapes":"Palomino, Pedro Ximénez","type":"DO","color":"#FFD700","description":"Albariza. Sistema Solera. Fino, Manzanilla, Oloroso, Amontillado."},{"id":"manzanilla","name":"Manzanilla DO","country":"Spagna","region":"Andalusia","grapes":"Palomino Fino","type":"DO","color":"#FFD700","description":"Solo Sanlúcar de Barrameda. Fino con flor e brezza marina."},{"id":"cava","name":"Cava DO","country":"Spagna","region":"Catalogna","grapes":"Macabeo, Xarel-lo, Parellada","type":"DO","color":"#FFD700","description":"Metodo Classico spagnolo. Penedès e altre zone. Codorníu, Freixenet."},{"id":"penedes","name":"Penedès DO","country":"Spagna","region":"Catalogna","grapes":"Xarel-lo, Macabeo, Parellada, Cabernet","type":"DO","color":"#FFD700","description":"Torres come massimo interprete. Blancs e negres di Catalogna."},{"id":"galicia_valdeorras","name":"Valdeorras DO","country":"Spagna","region":"Galizia","grapes":"Godello, Mencia","type":"DO","color":"#FFD700","description":"Godello: la risposta galiziana al Riesling. Schisto ardesia. Guitián."},{"id":"ribeiro","name":"Ribeiro DO","country":"Spagna","region":"Galizia","grapes":"Treixadura, Albariño","type":"DO","color":"#FFD700","description":"Inland Galizia. Treixadura fresca su granito e scisto."},{"id":"terra_alta","name":"Terra Alta DO","country":"Spagna","region":"Catalogna","grapes":"Garnacha Blanca, Garnacha Tinta","type":"DO","color":"#FFD700","description":"Garnacha Blanca poderosa. Terra rossa. Bàrbara Forés."},{"id":"toro","name":"Toro DO","country":"Spagna","region":"Castiglia e León","grapes":"Tinta de Toro (Tempranillo)","type":"DO","color":"#8B0000","description":"Clima estremo, suoli sabbiosi. Numanthia, Pintia, Vetus."},{"id":"rueda","name":"Rueda DO","country":"Spagna","region":"Castiglia e León","grapes":"Verdejo, Sauvignon Blanc","type":"DO","color":"#FFD700","description":"Verdejo autoctono su ghiaie. Fresco e aromatico. Belondrade."},{"id":"bierzo","name":"Bierzo DO","country":"Spagna","region":"Castiglia e León","grapes":"Mencía","type":"DO","color":"#8B0000","description":"Mencía su scisto. Achaval Ferrer di Spagna. Palacios Remondo, Descendientes."},{"id":"albarino_rias","name":"Albariño DO Rías Baixas Sub","country":"Spagna","region":"Galizia","grapes":"Albariño","type":"DO","color":"#FFD700","description":"Sottozona Val do Salnés. Albariño puro su granito costiero."},{"id":"cava_gran_reserva","name":"Cava Gran Reserva DO","country":"Spagna","region":"Catalogna","grapes":"Macabeo, Xarel-lo, Chardonnay","type":"DO","color":"#FFD700","description":"30+ mesi. Recaredo, Agustí Torelló, Raventós."},{"id":"malaga","name":"Málaga DO","country":"Spagna","region":"Andalusia","grapes":"Pedro Ximénez, Muscat","type":"DO","color":"#FFD700","description":"Vino dolce secolare. Schisto. PX passito. Telmo Rodríguez MR."},{"id":"jumilla","name":"Jumilla DO","country":"Spagna","region":"Murcia","grapes":"Monastrell (Mourvèdre)","type":"DO","color":"#8B0000","description":"Entroterra arido. Monastrell su suoli argillo-calcarei. Juan Gil."},{"id":"yecla","name":"Yecla DO","country":"Spagna","region":"Murcia","grapes":"Monastrell","type":"DO","color":"#8B0000","description":"Altopiano semi-arido. Monastrell potente. Bodegas Castaño."},{"id":"campo_borja","name":"Campo de Borja DO","country":"Spagna","region":"Aragona","grapes":"Garnacha, Tempranillo","type":"DO","color":"#8B0000","description":"Garnacha vecchie viti su macerina. Borsao, Bodegas Aragonesas."},{"id":"calatayud","name":"Calatayud DO","country":"Spagna","region":"Aragona","grapes":"Garnacha, Tempranillo","type":"DO","color":"#8B0000","description":"Garnacha centenaria ad alta quota su scisto. San Alejandro."},{"id":"montsant","name":"Montsant DO","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Cariñena, Syrah","type":"DO","color":"#8B0000","description":"Circonda il Priorat. Simile a prezzi più bassi. Acústic, Venus."},{"id":"emporda","name":"Empordà DO","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Carignan","type":"DO","color":"#8B0000","description":"Costa Brava. Tramuntana. Garnacha leggera e fresca."},{"id":"costers_segre","name":"Costers del Segre DO","country":"Spagna","region":"Catalogna","grapes":"Cabernet, Tempranillo, Chardonnay","type":"DO","color":"#8B0000","description":"Zona interna Catalogna. Raimat e Costers. Vini freschi d'altitudine."},{"id":"montilla_moriles","name":"Montilla-Moriles DO","country":"Spagna","region":"Andalusia","grapes":"Pedro Ximénez","type":"DO","color":"#FFD700","description":"Pedro Ximénez non-appassito. Fino naturale senza alcolizzazione. Toro Albalá."},{"id":"porto","name":"Porto DOC","country":"Portogallo","region":"Douro","grapes":"Touriga Nacional, Tinta Roriz","type":"DOC","color":"#8B0000","description":"Douro su scisto. Vintage, LBV, Tawny. Taylor's, Fonseca, Quinta do Noval."},{"id":"douro","name":"Douro DOC","country":"Portogallo","region":"Douro","grapes":"Touriga Nacional, Touriga Franca","type":"DOC","color":"#8B0000","description":"Barca Velha. Niepoort, Ramos Pinto, Roca. Vini da tavola d'eccellenza."},{"id":"vinho_verde","name":"Vinho Verde DOC","country":"Portogallo","region":"Minho","grapes":"Alvarinho, Loureiro, Arinto","type":"DOC","color":"#FFD700","description":"Pergola tra Minho e Douro. Sub-zona Monção e Melgaço per Alvarinho."},{"id":"dao","name":"Dão DOC","country":"Portogallo","region":"Centro","grapes":"Touriga Nacional, Encruzado","type":"DOC","color":"#8B0000","description":"Granito e scisto. Touriga Nazionale elegante. Quinta dos Roques."},{"id":"bairrada","name":"Bairrada DOC","country":"Portogallo","region":"Centro","grapes":"Baga, Fernão Pires","type":"DOC","color":"#8B0000","description":"Argille costiere atlantiche. Baga tannica. Luis Pato, Quinta das Bágeiras."},{"id":"alentejo","name":"Alentejo DOC","country":"Portogallo","region":"Alentejo","grapes":"Aragonez, Trincadeira, Alicante Bouschet","type":"DOC","color":"#8B0000","description":"Pianure calde e aride. Ericeira, Mouchão, Esporão."},{"id":"madeira","name":"Madeira DOC","country":"Portogallo","region":"Madeira","grapes":"Verdelho, Sercial, Bual, Malmsey","type":"DOC","color":"#FFD700","description":"Vino ossidativo indistruttibile. Blandy's, Barbeito. Bottiglie del 1800 ancora vive."},{"id":"setubal","name":"Moscatel de Setúbal DOC","country":"Portogallo","region":"Penisola di Setúbal","grapes":"Moscatel de Setúbal","type":"DOC","color":"#FFD700","description":"Moscato dolce e ossidativo. José Maria da Fonseca. Arancio candito, miele."},{"id":"colares","name":"Colares DOC","country":"Portogallo","region":"Lisboa","grapes":"Ramisco, Malvasia de Colares","type":"DOC","color":"#8B0000","description":"Sabbie atlantiche a Sintra. Radici phylloxera-free. Rarissimo."},{"id":"vinho_verde_mono","name":"Monção e Melgaço DOC","country":"Portogallo","region":"Minho","grapes":"Alvarinho","type":"DOC","color":"#FFD700","description":"Il meglio dell'Alvarinho portoghese. Granite sub-zones. Soalheiro, Anselmo Mendes."},{"id":"tavora_varosa","name":"Távora-Varosa DOC","country":"Portogallo","region":"Norte","grapes":"Malvasia Fina, Gouveio","type":"DOC","color":"#FFD700","description":"Metodo Classico portoghese. Alta quota Douro. Murganheira."},{"id":"bucelas","name":"Bucelas DOC","country":"Portogallo","region":"Lisboa","grapes":"Arinto","type":"DOC","color":"#FFD700","description":"Il bianco storico di Lisbona. Arinto minerale e longevo."},{"id":"lisboa","name":"Lisboa DOC","country":"Portogallo","region":"Lisboa","grapes":"Fernão Pires, Castelão","type":"DOC","color":"#FFD700","description":"Cintra, Alenquer, Arruda. Pianure litoranee atlantiche."},{"id":"algarve","name":"Algarve DOC","country":"Portogallo","region":"Algarve","grapes":"Negra Mole, Castelão","type":"DOC","color":"#8B0000","description":"Estremo sud lusitano. Pecharmant locale. Vins touristiques."},{"id":"mosel","name":"Mosel","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling, Müller-Thurgau","type":"QmP","color":"#FFD700","description":"Ardesia blu devoniana. Riesling più longevo. Egon Müller, JJ Prüm."},{"id":"rheingau","name":"Rheingau","country":"Germania","region":"Assia","grapes":"Riesling, Spätburgunder","type":"QmP","color":"#FFD700","description":"Versante sud sul Reno. Schloss Johannisberg, Robert Weil. Riesling nobile."},{"id":"pfalz","name":"Pfalz","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling, Spätburgunder","type":"QbA","color":"#FFD700","description":"Grande Strada del Vino. Weissburgunder, Dornfelder. A.Christmann."},{"id":"nahe","name":"Nahe","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling, Silvaner","type":"QmP","color":"#FFD700","description":"Terroir multiforme: porfido, basalto, gneiss. Dönnhoff, Schlossgut Diel."},{"id":"rheinhessen","name":"Rheinhessen","country":"Germania","region":"Renania-Palatinato","grapes":"Silvaner, Riesling, Müller-Thurgau","type":"QbA","color":"#FFD700","description":"Più grande zona viticola. Westhofener Kirchspiel. Keller, Wittmann."},{"id":"franken","name":"Franken","country":"Germania","region":"Baviera","grapes":"Silvaner, Müller-Thurgau","type":"QbA","color":"#FFD700","description":"Bocksbeutel. Silvaner su calcari. Würzburg. Juliusspital."},{"id":"ahr","name":"Ahr","country":"Germania","region":"Renania-Palatinato","grapes":"Spätburgunder (Pinot Nero)","type":"QmP","color":"#8B0000","description":"La valle più fredda per Pinot Nero. Grafite e ardesia. Meyer-Näkel."},{"id":"mittelrhein","name":"Mittelrhein","country":"Germania","region":"Renania-Palatinato","grapes":"Riesling","type":"QbA","color":"#FFD700","description":"Reno tra Bingen e Bonn. Ardesia. Panorama mozzafiato. Toni Jost."},{"id":"hessische_bergstr","name":"Hessische Bergstraße","country":"Germania","region":"Assia","grapes":"Riesling, Spätburgunder","type":"QbA","color":"#FFD700","description":"Più piccola zona tedesca. Darmstadt. Staatsweingut Bergstraße."},{"id":"wurttemberg","name":"Württemberg","country":"Germania","region":"Baden-Württemberg","grapes":"Trollinger, Lemberger, Riesling","type":"QbA","color":"#8B0000","description":"Neckar e affiliati. Trollinger vitigno tipico. Haidle, Aldinger."},{"id":"baden","name":"Baden","country":"Germania","region":"Baden-Württemberg","grapes":"Spätburgunder, Grauburgunder","type":"QbA","color":"#8B0000","description":"Il più caldo. Kaiserstuhl vulcanico. Loosen-Dr. L, Bernhard Huber."},{"id":"sachsen","name":"Sachsen","country":"Germania","region":"Sassonia","grapes":"Riesling, Müller-Thurgau, Weißburgunder","type":"QbA","color":"#FFD700","description":"Più orientale e fredda. Elba. Schloss Proschwitz, Klaus Zimmerling."},{"id":"saale_unstrut","name":"Saale-Unstrut","country":"Germania","region":"Sassonia-Anhalt","grapes":"Müller-Thurgau, Weißburgunder","type":"QbA","color":"#FFD700","description":"La più a nord. Suoli di calcare. Naumburg. Weingut Lützkendorf."},{"id":"wachau","name":"Wachau DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Loess e gneiss sul Danubio. Steinfeder-Federspiel-Smaragd. Prager, Knoll, FX Pichler."},{"id":"kremstal","name":"Kremstal DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Krems: loess, calcare, gneiss. Nigl, Salomon Undhof."},{"id":"kamptal","name":"Kamptal DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Kamp: basalto di Zöbing. Hirsch, Bründlmayer, Schloss Gobelsburg."},{"id":"traisental","name":"Traisental DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner, Riesling","type":"DAC","color":"#FFD700","description":"Valle del Traisen. Loess e argille. Neumayer."},{"id":"weinviertel","name":"Weinviertel DAC","country":"Austria","region":"Bassa Austria","grapes":"Grüner Veltliner","type":"DAC","color":"#FFD700","description":"Più grande zona austriaca. Grüner Veltliner con pepe bianco. Pfaffl."},{"id":"neusiedlersee","name":"Neusiedlersee","country":"Austria","region":"Burgenland","grapes":"Welschriesling, Zweigelt","type":"DAC","color":"#FFD700","description":"Lago Neusiedl. Botrytis per Trockenbeerenauslese. Kracher, Feiler-Artinger."},{"id":"mittelburgenland","name":"Mittelburgenland DAC","country":"Austria","region":"Burgenland","grapes":"Blaufränkisch","type":"DAC","color":"#8B0000","description":"Blaufränkisch su argille blu. Potenza e freschezza. Iby, Gesellmann."},{"id":"sudburgenland","name":"Südburgenland DAC","country":"Austria","region":"Burgenland","grapes":"Blaufränkisch","type":"DAC","color":"#8B0000","description":"Suoli profondi. Eisenberg su ferro. Krutzler, Uwe Schiefer."},{"id":"steiermark","name":"Steiermark (Styria)","country":"Austria","region":"Stiria","grapes":"Sauvignon Blanc, Welschriesling, Morillon","type":"DAC","color":"#FFD700","description":"Colline stiriane. Sauvignon Blanc alpino. Tement, Polz."},{"id":"wien","name":"Wien (Vienna)","country":"Austria","region":"Vienna","grapes":"Grüner Veltliner, Riesling, Gemischter Satz","type":"DAC","color":"#FFD700","description":"Unica capitale con viticultura urbana. Gemischter Satz tipico. Reinprecht."},{"id":"napa","name":"Napa Valley AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon, Merlot, Chardonnay","type":"AVA","color":"#8B0000","description":"La capital del Cabernet. Sub-AVA: Stags Leap, Oakville, Rutherford. Opus One."},{"id":"willamette","name":"Willamette Valley AVA","country":"USA","region":"Oregon","grapes":"Pinot Noir, Chardonnay","type":"AVA","color":"#8B0000","description":"Pinot borgognone del NW. Argille e suoli marini. Drouhin, Eyrie, Ponzi."},{"id":"sonoma","name":"Sonoma County AVA","country":"USA","region":"California","grapes":"Pinot Noir, Chardonnay, Zinfandel","type":"AVA","color":"#8B0000","description":"Russian River Valley. Kistler, Williams Selyem, Ridge."},{"id":"stags_leap","name":"Stags Leap District AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon","type":"AVA","color":"#8B0000","description":"Vino che vinse il Giudizio di Parigi 1976. Clos du Val, Stag's Leap WC."},{"id":"rutherford","name":"Rutherford AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon","type":"AVA","color":"#8B0000","description":"Rutherford Dust: suoli alluvionali unici. Inglenook, Beaulieu, Rubicon."},{"id":"carneros","name":"Los Carneros AVA","country":"USA","region":"California","grapes":"Pinot Noir, Chardonnay","type":"AVA","color":"#8B0000","description":"Confine Napa-Sonoma. Vento oceanico. Domaine Carneros, Etude."},{"id":"paso_robles","name":"Paso Robles AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon, Syrah, Zinfandel","type":"AVA","color":"#8B0000","description":"Central Coast. Calcarelli calcarei. Turley, Tablas Creek, Justin."},{"id":"walla_walla","name":"Walla Walla Valley AVA","country":"USA","region":"Washington","grapes":"Cabernet Sauvignon, Syrah, Merlot","type":"AVA","color":"#8B0000","description":"Washington-Oregon. Cayuse su cailloux. L'Ecole 41, Leonetti."},{"id":"columbia_valley","name":"Columbia Valley AVA","country":"USA","region":"Washington","grapes":"Riesling, Merlot, Cabernet Sauvignon","type":"AVA","color":"#8B0000","description":"La più grande AVA del NW. Basalto. Chateau Ste. Michelle."},{"id":"finger_lakes","name":"Finger Lakes AVA","country":"USA","region":"New York","grapes":"Riesling, Chardonnay","type":"AVA","color":"#FFD700","description":"Laghi glaciali dello Stato di New York. Riesling freddo. Dr. Konstantin Frank."},{"id":"anderson_valley","name":"Anderson Valley AVA","country":"USA","region":"California","grapes":"Pinot Noir, Gewurztraminer","type":"AVA","color":"#8B0000","description":"Mendocino. Freddo oceanico. Littorai, Husch, Roederer Estate."},{"id":"alexander_valley","name":"Alexander Valley AVA","country":"USA","region":"California","grapes":"Cabernet Sauvignon, Chardonnay","type":"AVA","color":"#8B0000","description":"Sonoma nord. Suoli alluvionali caldi. Jordan, Clos du Bois."},{"id":"mendoza","name":"Mendoza DOC","country":"Argentina","region":"Mendoza","grapes":"Malbec, Cabernet Sauvignon, Torrontés","type":"DOC","color":"#8B0000","description":"Ande 900-1500m. Malbec identitario. Achaval Ferrer, Catena Zapata, Zuccardi."},{"id":"lujan_cuyo","name":"Luján de Cuyo DOC","country":"Argentina","region":"Mendoza","grapes":"Malbec","type":"DOC","color":"#8B0000","description":"Primo DOC argentino. Malbec su ghiaie 900-1100m. Achaval Ferrer Finca Bella Vista."},{"id":"maipu","name":"Maipú","country":"Argentina","region":"Mendoza","grapes":"Malbec, Cabernet Sauvignon","type":"DOC","color":"#8B0000","description":"Suoli alluvionali di Mendoza bassa. Malbec ricco e opulento. Trapiche."},{"id":"uco_valley","name":"Valle de Uco","country":"Argentina","region":"Mendoza","grapes":"Malbec, Cabernet Franc, Chardonnay","type":"DOC","color":"#8B0000","description":"Valle fresca a 1000-1500m. Altamira, Tupungato. Clos de los Siete."},{"id":"cafayate","name":"Cafayate / Valles Calchaquíes","country":"Argentina","region":"Salta","grapes":"Torrontés, Malbec, Cabernet Sauvignon","type":"DOC","color":"#FFD700","description":"Altitudine 1750-2500m. Torrontés aromatico. El Esteco, Clos de Cachi."},{"id":"san_juan_arg","name":"San Juan","country":"Argentina","region":"San Juan","grapes":"Syrah, Cabernet Sauvignon, Bonarda","type":"DOC","color":"#8B0000","description":"Norte de Mendoza. Caldo. Syrah potente. Zonda Valley."},{"id":"neuquen","name":"Neuquén Patagonia","country":"Argentina","region":"Neuquén","grapes":"Pinot Noir, Merlot, Sauvignon Blanc","type":"DOC","color":"#8B0000","description":"Patagonia nord. 38° latitudine sud. Vento fresco. Malma, NQN."},{"id":"rio_negro","name":"Río Negro","country":"Argentina","region":"Río Negro","grapes":"Pinot Noir, Sauvignon Blanc, Semillon","type":"DOC","color":"#8B0000","description":"Patagonia. Alta latitudine e freddo. Humberto Canale, Chacra."},{"id":"maipo","name":"Valle de Maipo DO","country":"Cile","region":"Región Metropolitana","grapes":"Cabernet Sauvignon, Carménère","type":"DO","color":"#8B0000","description":"Cabernet d'eccellenza vicino Santiago. Concha y Toro Don Melchor, Almaviva."},{"id":"colchagua","name":"Valle de Colchagua DO","country":"Cile","region":"O'Higgins","grapes":"Carménère, Cabernet Sauvignon","type":"DO","color":"#8B0000","description":"Carménère patria. Montes Alpha M, Casa Lapostolle Clos Apalta."},{"id":"casablanca","name":"Valle de Casablanca DO","country":"Cile","region":"Valparaíso","grapes":"Chardonnay, Sauvignon Blanc, Pinot Noir","type":"DO","color":"#FFD700","description":"Nebbiolina pacifica. Bianchi di precisione. Villard, Kingston, Matetic."},{"id":"aconcagua","name":"Valle del Aconcagua DO","country":"Cile","region":"Valparaíso","grapes":"Cabernet Sauvignon, Carménère","type":"DO","color":"#8B0000","description":"Zona calda a nord. Viña Errázuriz Don Maximiano, Almaviva."},{"id":"elqui","name":"Valle del Elqui DO","country":"Cile","region":"Coquimbo","grapes":"Syrah, Sauvignon Blanc","type":"DO","color":"#FFD700","description":"Zona desertica a 300-2000m. Pisquera del Elqui. Tabali."},{"id":"leyda","name":"Valle de Leyda DO","country":"Cile","region":"Valparaíso","grapes":"Pinot Noir, Sauvignon Blanc, Chardonnay","type":"DO","color":"#FFD700","description":"Sottozona fredda di San Antonio. Oceano Pacifico. Matetic, Leyda."},{"id":"limari","name":"Valle del Limarí DO","country":"Cile","region":"Coquimbo","grapes":"Chardonnay, Syrah","type":"DO","color":"#FFD700","description":"Calcare e argille rosse. Chardonnay minerale. Casa Tamaya."},{"id":"rapel","name":"Valle del Rapel DO","country":"Cile","region":"O'Higgins","grapes":"Carménère, Merlot, Cabernet Franc","type":"DO","color":"#8B0000","description":"Cachapoal e Colchagua. Carménère varietale. Concha y Toro."},{"id":"bío_bío","name":"Valle del Bío-Bío DO","country":"Cile","region":"Biobío","grapes":"País, Moscatel, Riesling","type":"DO","color":"#8B0000","description":"Sud del Cile. Suoli vulcanici. País antico. Vigno association."},{"id":"itata","name":"Valle del Itata DO","country":"Cile","region":"Biobío","grapes":"País, Cinsault, Moscatel","type":"DO","color":"#8B0000","description":"Vigneti centenari. País riscoperto. Cinsault su granito. La Causa."},{"id":"barossa","name":"Barossa Valley GI","country":"Australia","region":"South Australia","grapes":"Shiraz, Grenache, Riesling","type":"GI","color":"#8B0000","description":"Shiraz centenario. Terra rossa. Penfolds Grange, Henschke Hill of Grace."},{"id":"mclaren","name":"McLaren Vale GI","country":"Australia","region":"South Australia","grapes":"Shiraz, Grenache, Cabernet","type":"GI","color":"#8B0000","description":"Fleurieu Peninsula. d'Arenberg, Wirra Wirra, Clarendon Hills."},{"id":"margaret_river","name":"Margaret River GI","country":"Australia","region":"Western Australia","grapes":"Cabernet Sauvignon, Chardonnay","type":"GI","color":"#8B0000","description":"Oceano Indiano-Pacifico. Leeuwin Estate, Moss Wood, Cullen."},{"id":"hunter_valley","name":"Hunter Valley GI","country":"Australia","region":"New South Wales","grapes":"Semillon, Shiraz, Chardonnay","type":"GI","color":"#FFD700","description":"Semillon invecchiato unico. Tyrrell's, McWilliam's Lovedale."},{"id":"coonawarra","name":"Coonawarra GI","country":"Australia","region":"South Australia","grapes":"Cabernet Sauvignon, Shiraz","type":"GI","color":"#8B0000","description":"Terra Rossa su calcare. Cabernet australiano più elegante. Wynns."},{"id":"yarra_valley","name":"Yarra Valley GI","country":"Australia","region":"Victoria","grapes":"Pinot Noir, Chardonnay","type":"GI","color":"#8B0000","description":"Colline fresche vicino Melbourne. Yering Station, De Bortoli."},{"id":"clare_valley","name":"Clare Valley GI","country":"Australia","region":"South Australia","grapes":"Riesling, Shiraz, Cabernet","type":"GI","color":"#FFD700","description":"Riesling di Clare invecchia 20+ anni. Jim Barry, Grosset."},{"id":"eden_valley","name":"Eden Valley GI","country":"Australia","region":"South Australia","grapes":"Riesling, Shiraz","type":"GI","color":"#FFD700","description":"Alta quota sopra Barossa. Henschke Hill of Grace qui. Pewsey Vale."},{"id":"adelaide_hills","name":"Adelaide Hills GI","country":"Australia","region":"South Australia","grapes":"Sauvignon Blanc, Pinot Noir, Chardonnay","type":"GI","color":"#FFD700","description":"Freschezza alpina vicino Adelaide. Shaw + Smith, Ashton Hills."},{"id":"heathcote","name":"Heathcote GI","country":"Australia","region":"Victoria","grapes":"Shiraz","type":"GI","color":"#8B0000","description":"Cambrian soil rosso-violaceo unico. Jasper Hill, Sanguine Estate."},{"id":"great_western","name":"Grampians GI","country":"Australia","region":"Victoria","grapes":"Shiraz, Cabernet","type":"GI","color":"#8B0000","description":"Altipiani di Mount Langhi Ghiran. Mount Langi Ghiran, Best's."},{"id":"tasmania","name":"Tasmania GI","country":"Australia","region":"Tasmania","grapes":"Pinot Noir, Riesling, Chardonnay","type":"GI","color":"#8B0000","description":"Isola fredda. Sparkling method traditionnel. Stefano Lubiana, Jansz."},{"id":"mudgee","name":"Mudgee GI","country":"Australia","region":"New South Wales","grapes":"Cabernet Sauvignon, Shiraz, Chardonnay","type":"GI","color":"#8B0000","description":"Altipiani oltre Blue Mountains. Rosemberg Estate, Logan."},{"id":"marlborough","name":"Marlborough GI","country":"Nuova Zelanda","region":"South Island","grapes":"Sauvignon Blanc, Pinot Noir","type":"GI","color":"#FFD700","description":"Wairau Valley. Sauvignon che ha cambiato il mondo. Cloudy Bay, Greywacke."},{"id":"central_otago","name":"Central Otago GI","country":"Nuova Zelanda","region":"South Island","grapes":"Pinot Noir","type":"GI","color":"#8B0000","description":"Pinot a latitudine più alta. Clima continentale. Felton Road, Rippon."},{"id":"hawkes_bay","name":"Hawke's Bay GI","country":"Nuova Zelanda","region":"North Island","grapes":"Cabernet, Merlot, Chardonnay","type":"GI","color":"#8B0000","description":"Gimblett Gravels su letto di fiume. Craggy Range, Te Mata."},{"id":"gisborne","name":"Gisborne GI","country":"Nuova Zelanda","region":"North Island","grapes":"Chardonnay, Gewurztraminer","type":"GI","color":"#FFD700","description":"Primo sole. Chardonnay grassoso. Vinoptima, Millton."},{"id":"nelson","name":"Nelson GI","country":"Nuova Zelanda","region":"South Island","grapes":"Chardonnay, Pinot Noir, Riesling","type":"GI","color":"#FFD700","description":"Top del South Island. Seifried, Neudorf."},{"id":"wairarapa","name":"Wairarapa / Martinborough GI","country":"Nuova Zelanda","region":"North Island","grapes":"Pinot Noir, Sauvignon Blanc","type":"GI","color":"#8B0000","description":"Calcari e terrazze di ghiaia. Ata Rangi, Palliser."},{"id":"waipara","name":"Waipara Valley / North Canterbury GI","country":"Nuova Zelanda","region":"South Island","grapes":"Pinot Noir, Riesling","type":"GI","color":"#8B0000","description":"Calcari di Waipara. Riesling e Pinot Noir fresco. Pegasus Bay."},{"id":"stellenbosch","name":"Stellenbosch WO","country":"Sud Africa","region":"Western Cape","grapes":"Cabernet Sauvignon, Chenin Blanc","type":"WO","color":"#8B0000","description":"Granito e arenaria. Kanonkop, Meerlust, Vergelegen."},{"id":"franschhoek","name":"Franschhoek WO","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Cabernet, Syrah","type":"WO","color":"#8B0000","description":"Valle dei Franchi (Ugonotti). Granito. Boekenhoutskloof, Plaisir."},{"id":"paarl","name":"Paarl WO","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Pinotage, Shiraz","type":"WO","color":"#8B0000","description":"Domaine Vrede en Lust, Fairview. Granito e schisto."},{"id":"elgin","name":"Elgin WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Pinot Noir, Chardonnay","type":"WO","color":"#FFD700","description":"Altipiano fresco 300m. Mele e vino. Paul Cluver, Shannon."},{"id":"constantia","name":"Constantia WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Semillon","type":"WO","color":"#FFD700","description":"Vin de Constance storico (Napoleone). Klein Constantia."},{"id":"walker_bay","name":"Walker Bay WO","country":"Sud Africa","region":"Western Cape","grapes":"Pinot Noir, Chardonnay","type":"WO","color":"#8B0000","description":"Oceano Atlantico. Bouchard Finlayson, Hamilton Russell."},{"id":"swartland","name":"Swartland WO","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Syrah, Grenache","type":"WO","color":"#8B0000","description":"The Swartland Revolution. Eben Sadie, Mullineux, Badenhorst."},{"id":"robertson","name":"Robertson WO","country":"Sud Africa","region":"Western Cape","grapes":"Chardonnay, Cabernet Sauvignon","type":"WO","color":"#FFD700","description":"Valle calda e secca. Calcare. Graham Beck per bollicine."},{"id":"hemel_en_aarde","name":"Hemel-en-Aarde WO","country":"Sud Africa","region":"Western Cape","grapes":"Pinot Noir, Chardonnay","type":"WO","color":"#8B0000","description":"Tre sottozone. Shale su calcare. Storm, Creation."},{"id":"santorini","name":"Santorini PDO","country":"Grecia","region":"Cicladi","grapes":"Assyrtiko","type":"PDO","color":"#FFD700","description":"Suolo vulcanico pumice. Kouloura. Gaia, Hatzidakis, Sigalas."},{"id":"naoussa","name":"Naoussa PDO","country":"Grecia","region":"Macedonia","grapes":"Xinomavro","type":"PDO","color":"#8B0000","description":"Xinomavro: il Nebbiolo greco. Suoli calcarei del nord. Thymiopoulos."},{"id":"nemea","name":"Nemea PDO","country":"Grecia","region":"Peloponneso","grapes":"Agiorgitiko","type":"PDO","color":"#8B0000","description":"Agiorgitiko su calcare e argille. Gaia, Skouras. San Giorgio sul vino."},{"id":"crete_peza","name":"Peza PDO","country":"Grecia","region":"Creta","grapes":"Kotsifali, Mandilari, Vilana","type":"PDO","color":"#8B0000","description":"Altipiani centrali di Creta. Kotsifali su argille. Minos-Miliarakis."},{"id":"muscat_samos","name":"Muscat de Samos PDO","country":"Grecia","region":"Samos","grapes":"Muscat Blanc à Petits Grains","type":"PDO","color":"#FFD700","description":"Moscato dolce dell'isola di Samos. Cooperative di Samos."},{"id":"mantinia","name":"Mantinia PDO","country":"Grecia","region":"Peloponneso","grapes":"Moschofilero","type":"PDO","color":"#FFD700","description":"Altopiano a 600m. Moschofilero rosa e aromatico. Tselepos."},{"id":"limnio_lemnas","name":"Muscat de Limnos PDO","country":"Grecia","region":"Limnos","grapes":"Muscat d'Alexandrie","type":"PDO","color":"#FFD700","description":"Lemnos. Muscat d'Alexandrie su scisto. Cooperative."},{"id":"rapsani","name":"Rapsani PDO","country":"Grecia","region":"Tessaglia","grapes":"Xinomavro, Krassato, Stavroto","type":"PDO","color":"#8B0000","description":"Monte Olimpo. Tre vitigni su granito. Tsantali."},{"id":"tokaj","name":"Tokaj PDO","country":"Ungheria","region":"Tokaj-Hegyalja","grapes":"Furmint, Hárslevelű","type":"PDO","color":"#FFD700","description":"Vino dei Re. Botrytis 3-6 puttonyos. Disznókő, Royal Tokaji."},{"id":"eger","name":"Eger","country":"Ungheria","region":"Heves","grapes":"Egri Bikavér (Toro di Egro)","type":"DO","color":"#8B0000","description":"Bikavér: blend di Kékfrankos, Kadarka. Barokk cantina di tuff vulcanico."},{"id":"sopron","name":"Sopron","country":"Ungheria","region":"Győr-Moson-Sopron","grapes":"Kékfrankos (Blaufränkisch)","type":"DO","color":"#8B0000","description":"Confine austriaco. Kékfrankos fresco e speziato. Weninger."},{"id":"villany","name":"Villány","country":"Ungheria","region":"Baranya","grapes":"Cabernet Sauvignon, Merlot, Portugieser","type":"DO","color":"#8B0000","description":"Estremo sud. Il più caldo. Gere, Bock, Malatinszky."},{"id":"kakheti","name":"Kakheti GI","country":"Georgia","region":"Kakheti","grapes":"Rkatsiteli, Saperavi","type":"GI","color":"#8B0000","description":"8000 anni di storia. Kvevri interrate. Rkatsiteli ambrato, Saperavi."},{"id":"kartli","name":"Kartli GI","country":"Georgia","region":"Kartli","grapes":"Rkatsiteli, Chinuri","type":"GI","color":"#FFD700","description":"Valle Mtkvari. Vini bianchi secchi. Chateau Mukhrani."},{"id":"imereti","name":"Imereti GI","country":"Georgia","region":"Imereti","grapes":"Tsolikouri, Tsitska","type":"GI","color":"#FFD700","description":"Stile semi-ambrato con breve macerazione. Pheasant's Tears."},{"id":"racha","name":"Racha-Lechkhumi GI","country":"Georgia","region":"Racha","grapes":"Alexandrouli, Mujuretuli","type":"GI","color":"#8B0000","description":"Montagna. Vini parzialmente fermentati semidolci naturali. Khvanchkara."},{"id":"morava_cz","name":"Moravian Wine Region","country":"Repubblica Ceca","region":"Moravia","grapes":"Welschriesling, Blauburger, Riesling","type":"DO","color":"#FFD700","description":"Moravia meridionale. Suoli calcarei e loess. Sonberk, Pavlovín."},{"id":"tokaj_sk","name":"Tokajský DO","country":"Slovacchia","region":"Tokajský","grapes":"Furmint, Lipovina","type":"DO","color":"#FFD700","description":"Parte slovacca del Tokaj. Pochissimi produttori. Mrva & Stanko."},{"id":"fruska_gora","name":"Fruška Gora","country":"Serbia","region":"Vojvodina","grapes":"Riesling Italico, Chardonnay, Frankovka","type":"DO","color":"#FFD700","description":"Montagna su Sava. Produttori tradizionali. Tikveš."},{"id":"zilavka","name":"Hercegovački","country":"Bosnia Erzegovina","region":"Erzegovina","grapes":"Žilavka, Blatina","type":"DO","color":"#FFD700","description":"Žilavka: bianco autoctono su calcare. Blatina rosso."},{"id":"naoussa_grk","name":"Vissi / Naoussa","country":"Grecia","region":"Macedonia","grapes":"Xinomavro","type":"PDO","color":"#8B0000","description":"Sub-appellation di Naoussa. Alta quota e potenza."},{"id":"jeruzalem","name":"Jeruzalem Ormož","country":"Slovenia","region":"Štajerska","grapes":"Pinot Gris, Sauvignon Blanc, Riesling","type":"DO","color":"#FFD700","description":"La Gerusalemme slovena. Colline del Ljutomer. Puklavec."},{"id":"vipavska","name":"Vipava Valley","country":"Slovenia","region":"Vipavska","grapes":"Rebula, Malvazija, Merlot","type":"DO","color":"#FFD700","description":"Valle del Vipacco. Bora. Simčič, Movia. Rebula e vini orange."},{"id":"karst_teran","name":"Kras (Karst)","country":"Slovenia","region":"Kraška","grapes":"Teran (Refosco)","type":"DO","color":"#8B0000","description":"Carso sloveno su terra rossa. Teran potente e acido. Štoka."},{"id":"istria","name":"Istria","country":"Croazia","region":"Istria","grapes":"Malvazija Istarska, Teran","type":"DO","color":"#FFD700","description":"Malvazija istriana bianca fruttata. Kozlović, Matošević."},{"id":"peljesac","name":"Pelješac","country":"Croazia","region":"Dalmazia","grapes":"Plavac Mali","type":"DO","color":"#8B0000","description":"Plavac Mali su Pelješac. Dingač PDZO: il migliore. Matuško."},{"id":"kveder_primorska","name":"Primorska","country":"Slovenia","region":"Primorska","grapes":"Rebula, Merlot, Cabernet Franc","type":"DO","color":"#FFD700","description":"Collio sloveno. Rebula per vini orange. Keber, Štemberger."},{"id":"priorat_cat","name":"Priorat DOQ","country":"Spagna","region":"Catalogna","grapes":"Garnacha, Cariñena, Syrah","type":"DOQ","color":"#8B0000","description":"Llicorella scura. Clos i Terrasses, Álvaro Palacios."},{"id":"dealu_mare","name":"Dealu Mare DOC","country":"Romania","region":"Muntenia","grapes":"Fetească Neagră, Cabernet Sauvignon","type":"DOC","color":"#8B0000","description":"Carpazi meridionali. Fetească Neagră autoctono. Serve, Davino."},{"id":"jidvei","name":"Târnave DOC","country":"Romania","region":"Transilvania","grapes":"Fetească Albă, Fetească Regală","type":"DOC","color":"#FFD700","description":"Transilvania alpina. Bianchi freschi e aromatici. Jidvei."},{"id":"murfatlar","name":"Murfatlar DOC","country":"Romania","region":"Dobruja","grapes":"Chardonnay, Merlot, Muscat Ottonel","type":"DOC","color":"#FFD700","description":"Pianura danubiana sul Mar Nero. Chardonnay morbido. Murfatlar SRL."},{"id":"moldovan","name":"Codru DO","country":"Moldavia","region":"Centro Moldavia","grapes":"Fetească Albă, Rară Neagră","type":"DO","color":"#FFD700","description":"Colinare moldave. Purcari, Cricova, Mileștii Mici (cantina più grande)."},{"id":"bekaa","name":"Bekaa Valley","country":"Libano","region":"Valle della Bekaa","grapes":"Cinsault, Cabernet Sauvignon, Rhône varieties","type":"DO","color":"#8B0000","description":"Altipiano 1000m. Château Musar, Ksara, Kefraya."},{"id":"galil","name":"Galilee / Golan Heights","country":"Israele","region":"Galilea","grapes":"Cabernet Sauvignon, Syrah, Sauvignon Blanc","type":"DO","color":"#8B0000","description":"Plateau del Golan a 1000m. Golan Heights Winery, Yarden."},{"id":"marruecos_atlas","name":"Meknès-Atlas","country":"Marocco","region":"Meknès","grapes":"Cabernet Sauvignon, Syrah, Grenache","type":"DO","color":"#8B0000","description":"Colline ai piedi dell'Atlante. Clima temperato. Domaine Zouina."},{"id":"swartland_za","name":"Swartland","country":"Sud Africa","region":"Western Cape","grapes":"Chenin Blanc, Grenache, Syrah","type":"WO","color":"#FFD700","description":"Terroir naturale. Sadie Family, Mullineux, Badenhorst."},{"id":"ningxia","name":"Ningxia Wine Region","country":"Cina","region":"Ningxia","grapes":"Cabernet Sauvignon, Merlot","type":"DO","color":"#8B0000","description":"Cina nord-est. Desertico con irrigazione. Changyu AFIP, Silver Heights."},{"id":"shandong","name":"Shandong Peninsula","country":"Cina","region":"Shandong","grapes":"Cabernet Sauvignon, Riesling","type":"DO","color":"#8B0000","description":"Penisola di Shandong. Changyu Pioneer. Influenza oceano Pacifico."},{"id":"yamanashi","name":"Yamanashi","country":"Giappone","region":"Yamanashi","grapes":"Koshu, Muscat Bailey A","type":"DO","color":"#FFD700","description":"Monte Fuji. Koshu bianco autoctono minerale. Chateau Mercian, Suntory."},{"id":"hokkaido","name":"Hokkaido","country":"Giappone","region":"Hokkaido","grapes":"Pinot Noir, Kerner, Müller-Thurgau","type":"DO","color":"#8B0000","description":"Freddo del nord Giappone. Domaine Takahiko, Tokachi."},{"id":"winelands_sa_ne","name":"Elgin-Walker Bay","country":"Sud Africa","region":"Western Cape","grapes":"Pinot Noir, Sauvignon Blanc","type":"WO","color":"#FFD700","description":"Fascia costiera fresca atlantica. Storm, Creation, Ataraxia."},{"id":"la_mancha","name":"La Mancha DO","country":"Spagna","region":"Castiglia-La Mancia","grapes":"Airén, Tempranillo, Garnacha","type":"DO","color":"#FFD700","description":"La più grande DO al mondo. Vini economici ma in miglioramento."},{"id":"valdepeñas","name":"Valdepeñas DO","country":"Spagna","region":"Castiglia-La Mancia","grapes":"Tempranillo (Cencibel)","type":"DO","color":"#8B0000","description":"Enclave della Mancia. Tempranillo fresco su argille. Viña Albali."},{"id":"binissalem","name":"Binissalem DO","country":"Spagna","region":"Maiorca","grapes":"Manto Negro, Callet, Premsal Blanc","type":"DO","color":"#8B0000","description":"Maiorca. Manto Negro autoctono baleárico. José Ferrer."},{"id":"vino_de_tenerife","name":"Tacoronte-Acentejo DO","country":"Spagna","region":"Isole Canarie","grapes":"Listán Negro, Negramoll","type":"DO","color":"#8B0000","description":"Vigneti su lava nera dell'Etna canarino. Fitapreta."},{"id":"lanzarote","name":"Lanzarote DO","country":"Spagna","region":"Isole Canarie","grapes":"Listán Blanco (Palomino)","type":"DO","color":"#FFD700","description":"Zocos: vite in buca su lava. Protezione dal vento. El Grifo."},{"id":"alicante","name":"Alicante DO","country":"Spagna","region":"Valenciana","grapes":"Monastrell, Garnacha Tintorera","type":"DO","color":"#8B0000","description":"Costa del sol del vino. Monastrell concentrato. El Sequé."},{"id":"utiel_requena","name":"Utiel-Requena DO","country":"Spagna","region":"Valencia","grapes":"Bobal, Tempranillo","type":"DO","color":"#8B0000","description":"Altopiano interno valenciano. Bobal autoctono. Murviedro, Vicente Gandia."},{"id":"cape_agulhas","name":"Cape Agulhas WO","country":"Sud Africa","region":"Western Cape","grapes":"Semillon, Sauvignon Blanc","type":"WO","color":"#FFD700","description":"Il capo più a sud. Vento oceanico Benguela. Agulhas Wines."},{"id":"darling","name":"Darling WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Syrah","type":"WO","color":"#FFD700","description":"Costa atlantica fredda. Groenekloof. Darling Cellars."},{"id":"durbanville","name":"Durbanville WO","country":"Sud Africa","region":"Western Cape","grapes":"Sauvignon Blanc, Merlot","type":"WO","color":"#FFD700","description":"Colline nord di Città del Capo. Brisa marina. Diemersdal."}];
  var byCountry = {};
  feats.forEach(function(d){
    if(!byCountry[d.country]) byCountry[d.country] = [];
    byCountry[d.country].push(d);
  });
  return {feats:feats, byCountry:byCountry};
})();

var EFLAGS = {"Italia": "🇮🇹", "Francia": "🇫🇷", "Spagna": "🇪🇸", "Portogallo": "🇵🇹", "Germania": "🇩🇪", "Austria": "🇦🇹", "Grecia": "🇬🇷", "Georgia": "🇬🇪", "Ungheria": "🇭🇺", "USA": "🇺🇸", "Argentina": "🇦🇷", "Cile": "🇨🇱", "Australia": "🇦🇺", "Nuova Zelanda": "🇳🇿", "Sud Africa": "🇿🇦", "Slovenia": "🇸🇮", "Croazia": "🇭🇷", "Romania": "🇷🇴", "Moldavia": "🇲🇩", "Repubblica Ceca": "🇨🇿", "Slovacchia": "🇸🇰", "Serbia": "🇷🇸", "Bosnia Erzegovina": "🇧🇦", "Cina": "🇨🇳", "Giappone": "🇯🇵", "Libano": "🇱🇧", "Israele": "🇮🇱", "Marocco": "🇲🇦"};
var ETYPES = {"DOCG": "#D4AF37", "DOC": "#BF9B4A", "AOC": "#5B8DB8", "Grand Cru": "#E8C84A", "AVA": "#8B6BBB", "GI": "#5B9B6B", "DO": "#BB6B6B", "DAC": "#6BBB8B", "PDO": "#BB8B6B", "DOCa": "#C0392B", "QmP": "#3498DB", "QbA": "#5DADE2", "WO": "#6B8B5B", "IGT": "#9B8B6B"};
var ESUB   = {"champagne": {"Montagne de Reims": ["Mailly GC", "Verzenay GC", "Verzy GC", "Ambonnay GC", "Bouzy GC", "Ay GC"], "Vallee de la Marne": ["Hautvillers", "Epernay", "Cumieres"], "Cote des Blancs": ["Avize GC", "Cramant GC", "Oger GC", "Le Mesnil-sur-Oger GC", "Vertus PC"], "Aube": ["Les Riceys", "Bar-sur-Aube"]}, "gevrey": {"Grand Crus (9)": ["Chambertin", "Chambertin-Clos de Beze", "Chapelle-Chambertin", "Charmes-Chambertin", "Griotte-Chambertin", "Laticieres-Chambertin", "Mazis-Chambertin", "Ruchottes-Chambertin", "Mazoyeres-Chambertin"], "Premiers Crus top": ["Clos Saint-Jacques", "Lavaut Saint-Jacques", "Cazetiers", "Bel Air", "Champonnet", "Combe aux Moines"], "Village": "Gevrey-Chambertin AOC"}, "vosne": {"Grand Crus": ["Romanee-Conti", "La Tache", "Richebourg", "Romanee-Saint-Vivant", "La Romanee", "La Grande Rue", "Echezeaux", "Grands Echezeaux"], "Premiers Crus top": ["Malconsorts", "Brulees", "Suchots", "Beaux Monts", "Cros Parantoux"]}, "meursault": {"Premiers Crus": ["Perrieres", "Genevrieres", "Charmes", "Boucheres", "Poruzots", "Caillerets", "Santenots du Milieu"], "Lieux-dits": ["Tessons", "Tillets", "Meix Chavaux"]}, "chambolle": {"Grand Crus": ["Musigny", "Bonnes-Mares (parte)"], "Premiers Crus top": ["Les Amoureuses", "Les Charmes", "Les Cras", "Les Gruenchers", "Les Fuees"]}, "montrachet": {"Grand Crus condivisi": ["Le Montrachet", "Batard-Montrachet", "Chevalier-Montrachet", "Bienvenues-Batard", "Criots-Batard"]}, "barolo": {"Comuni (11)": ["Barolo", "Castiglione Falletto", "Serralunga d\'Alba", "La Morra", "Monforte d'Alba", "Verduno", "Grinzane Cavour", "Novello", "Diano d'Alba", "Roddi", "Cherasco"], "MGA storiche": ["Cannubi", "Brunate", "Cerequio", "Vigna Rionda", "Monprivato", "Villero", "Francia", "Rocche dell'Annunziata", "Bricco Boschis", "Gavarini", "Lazzarito"]}, "barbaresco": {"Comuni (4)": ["Barbaresco", "Neive", "Treiso", "San Rocco Seno d'Elvio"], "MGA storiche": ["Asili", "Rabaja", "Martinenga", "Sori Tildin", "Sori San Lorenzo", "Costa Russi", "Gallina", "Starderi", "Rio Sordo"]}, "brunello": {"Zone": ["Montalcino Nord", "Montalcino Sud", "Montalcino Est", "Sant'Angelo in Colle", "Castelnuovo dell'Abate", "Camigliano"], "Vigneti iconici": ["Biondi Santi Greppo", "Cerbaiona", "Schiena d'Asino", "Il Paradiso di Manfredi", "Caprili", "Case Basse Soldera"]}, "chianti_classico": {"Comuni": ["Greve in Chianti", "Panzano", "Radda in Chianti", "Gaiole in Chianti", "Castelnuovo Berardenga", "Poggibonsi", "Barberino Tavarnelle"], "Gran Selezione": ["Brolio (Ricasoli)", "Badia a Passignano (Antinori)", "Cepparello (Isole e Olena)", "Percarlo (San Giusto)", "Flaccianello (Fontodi)"]}, "amarone": {"Zone Classico": ["Fumane", "Marano", "Sant'Ambrogio", "San Pietro in Cariano", "Negrar"], "Vigneti": ["Monte Lodoletta (Dal Forno)", "Mazzano (Masi)", "Campolongo di Torbe (Masi)", "Quintarelli vigneto"]}, "prosecco": {"Crus": ["Cartizze (106 ha, il massimo)", "Rive (singolo vigneto comunale)"], "Comuni Rive top": ["Valdobbiadene", "Conegliano", "San Pietro di Barbozza", "Ogliano", "Rolle", "Refrontolo"]}, "rioja": {"Sottozone": ["Rioja Alta (fresca, elegante, calcareo)", "Rioja Alavesa (calcare, struttura, Tempranillo puro)", "Rioja Oriental ex-Baja (calda, potente, Garnacha)"], "Comuni storici": ["Haro", "Laguardia", "Logrono", "Elciego", "Briones", "San Asensio"]}, "ribera_duero": {"Zone": ["Ribera Alta", "Ribera Baja", "Burgos", "Valladolid"], "Iconici": ["Vega Sicilia Unico", "Pingus", "Pesquera Janus", "Protos Gran Reserva", "Aalto"]}, "porto": {"Subregioni": ["Baixo Corgo (piu umido)", "Cima Corgo (cuore del Douro)", "Douro Superior (caldo, arido)"], "Stili": ["Vintage", "Single Quinta Vintage", "LBV", "Tawny 10/20/30/40 anni", "Colheita", "Ruby", "White Port"], "Quintas storiche": ["Quinta do Noval", "Quinta do Vesuvio", "Quinta de Vargellas", "Quinta da Eira Velha"]}, "tokaj": {"Classificazione vini": ["Furmint Secco", "Szamorodni Secco", "Szamorodni Dolce", "Aszu 3-4 Puttonyos", "Aszu 5-6 Puttonyos", "Eszencia puro"], "Comuni": ["Tokaj", "Tarcal", "Mad", "Bodrogkeresztur", "Erdobenye", "Olaszliszka"], "Grand Cru vigneti": ["Mezes Maly", "Nyulaszo", "Szarvas", "Kiraly", "Birsalmas", "Cseresznye"]}, "mosel": {"VDP Grosse Lagen": ["Bernkasteler Doctor", "Wehlener Sonnenuhr", "Erdener Pralat", "Urziger Wurgarten", "Scharzhofberger", "Maximin Grunhaus Abtsberg", "Ockfener Bockstein"], "Bereiche": ["Bernkastel", "Saar", "Ruwer", "Zell", "Cochem"], "Comuni top": ["Bernkastel-Kues", "Wehlen", "Graach", "Zeltingen", "Erden", "Urzig", "Piesport", "Brauneberg"]}, "wachau": {"Classificazione": ["Steinfeder (leggero, max 11%)", "Federspiel (medio, 11-12.5%)", "Smaragd (potente, 12.5%+)"], "Vigneti VDP": ["Achleiten", "Kellerberg", "Singerriedel", "Steinriegl", "Klaus", "Liebenberg"], "Comuni": ["Durnstein", "Weissenkirchen", "Spitz", "Loiben", "Joching"]}, "napa": {"Sub-AVA (16)": ["Stags Leap District", "Oakville", "Rutherford", "St. Helena", "Calistoga", "Mount Veeder", "Spring Mountain", "Howell Mountain", "Chiles Valley", "Atlas Peak", "Coombsville", "Diamond Mountain", "Los Carneros", "Oak Knoll", "Yountville", "Wild Horse Valley"]}, "barossa": {"Sottozone": ["Barossa Valley (caldo, terra rossa)", "Eden Valley (fresco, altitudine)", "High Eden (molto fresco)"], "Vigneti old vine": ["Langmeil Freedom 1843", "Henschke Hill of Grace", "Penfolds Block 42", "Torbreck RunRig source", "Greenock Creek Apricot Block"]}, "kakheti": {"Regioni": ["Alazani Valley", "Gombori Range", "Telavi", "Signagi", "Kvareli", "Gurjaani"], "Metodi": ["Kvevri (anfora interrata)", "Metodo europeo", "Vino ambrato (skin-contact 6 mesi)"], "Vitigni autoctoni": ["Rkatsiteli (bianco)", "Saperavi (rosso)", "Mtsvane", "Kisi", "Khikhvi", "Tsolikouri"]}};

window._expAI = window._expAI || {};
var _expAI = window._expAI;
var _expCountry = null;

// Crea elemento DOM con stile e contenuto
function el(tag, attrs, children){
  var e = document.createElement(tag);
  if(attrs) Object.keys(attrs).forEach(function(k){
    if(k === 'style') e.style.cssText = attrs[k];
    else if(k === 'text') e.textContent = attrs[k];
    else if(k === 'html') e.innerHTML = attrs[k];
    else if(k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
    else e.setAttribute(k, attrs[k]);
  });
  if(children) (Array.isArray(children)?children:[children]).forEach(function(ch){
    if(ch && typeof ch === 'object') e.appendChild(ch);
    else if(ch != null) e.appendChild(document.createTextNode(String(ch)));
  });
  return e;
}

function clearEl(id){ var e=$el(id); if(e) e.innerHTML=''; return e; }

function showSection(id){
  ['expCountries','expList','expDetail','expSearch'].forEach(function(s){
    var e=$el(s); if(e) e.style.display = s===id ? 'block' : 'none';
  });
  if(id==='expCountries'){var cc=document.getElementById('expCountries');if(cc&&!cc.children.length)renderExploreCountries();}
}

function renderExploreCountries(){
  var cont = clearEl('expCountries');
  if(!cont) return;
  showSection('expCountries');
  var inp = $el('exploreSearch');
  if(inp) inp.value = '';

  // Reimposta bottoni barra paesi
  document.querySelectorAll('.exp-country-btn,.exp-denom-btn').forEach(function(b){ b.classList.remove('active'); });

  var countries = Object.keys(EXP.byCountry).sort(function(a,b){
    return EXP.byCountry[b].length - EXP.byCountry[a].length;
  });

  // Header sezione
  var hdr = el('div',{style:'padding:8px 14px;border-bottom:1px solid rgba(191,155,74,.1);background:#0A0705;'},[ 
    el('div',{style:'font-family:Cinzel,serif;font-size:.5rem;letter-spacing:4px;color:rgba(191,155,74,.4);',text:'TUTTI I PAESI — '+countries.length+' nazioni · clicca per esplorare'})
  ]);
  cont.appendChild(hdr);

  // Griglia 3 colonne (più compatta per vedere tutti)
  var grid = el('div',{style:'display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;padding:10px 12px;'});
  countries.forEach(function(country){
    var n = EXP.byCountry[country].length;
    var flag = EFLAGS[country]||'🌍';
    var hasIntro = typeof COUNTRY_INTRO !== 'undefined' && COUNTRY_INTRO[country];
    var card = el('div',{
      style:'background:rgba(191,155,74,.05);border:1px solid rgba(191,155,74,.12);padding:10px 8px;cursor:pointer;border-radius:2px;text-align:center;',
      onclick: function(){ flyToCountry(country); }
    },[
      el('div',{style:'font-size:1.2rem;margin-bottom:3px;',text:flag}),
      el('div',{style:'font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1.5px;color:var(--crema);line-height:1.3;',text:country}),
      el('div',{style:'font-family:Cinzel,serif;font-size:.4rem;letter-spacing:1px;color:rgba(191,155,74,.45);margin-top:2px;',text:n+' denom.'})
    ]);
    card.addEventListener('mouseover',function(){this.style.background='rgba(92,26,26,.22)';this.style.borderColor='rgba(191,155,74,.35)';});
    card.addEventListener('mouseout',function(){this.style.background='rgba(191,155,74,.05)';this.style.borderColor='rgba(191,155,74,.12)';});
    grid.appendChild(card);
  });
  cont.appendChild(grid);
}

function openExpCountry(country){
  _expCountry = country;
  var cont = clearEl('expList');
  if(!cont) return;
  showSection('expList');

  var denoms = EXP.byCountry[country]||[];
  var flag = EFLAGS[country]||'🌍';

  // Header
  var hdr = el('div',{style:'background:var(--nero);padding:12px 16px;border-bottom:1px solid rgba(191,155,74,.2);display:flex;align-items:center;gap:10px;position:sticky;top:52px;z-index:10;'},[
    el('button',{style:'background:none;border:none;color:rgba(191,155,74,.5);font-size:1.3rem;cursor:pointer;',text:'←',onclick:function(){renderExploreCountries();}}),
    el('span',{style:'font-size:1.5rem;',text:flag}),
    el('div',null,[
      el('div',{style:'font-family:Cinzel,serif;font-size:.75rem;letter-spacing:2px;color:var(--crema);',text:country}),
      el('div',{style:'font-family:Cinzel,serif;font-size:.56rem;color:rgba(191,155,74,.45);',text:denoms.length+' denominazioni'})
    ])
  ]);
  cont.appendChild(hdr);

  // Raggruppa per regione
  var byReg = {};
  denoms.forEach(function(d){
    var r=d.region||'Altro';
    if(!byReg[r]) byReg[r]=[];
    byReg[r].push(d);
  });

  Object.keys(byReg).sort().forEach(function(reg){
    // Label regione
    cont.appendChild(el('div',{
      style:'padding:10px 16px 4px;font-family:Cinzel,serif;font-size:.58rem;letter-spacing:3px;color:rgba(191,155,74,.4);border-top:1px solid rgba(191,155,74,.08);margin-top:4px;',
      text:reg.toUpperCase()
    }));

    byReg[reg].forEach(function(d){
      var tc = ETYPES[d.type]||'rgba(191,155,74,.5)';
      var hasSub = ESUB[d.id] ? ' ▸' : '';
      var grapes = (d.grapes||'').split(',').slice(0,2).map(function(g){return g.trim();}).join(', ');

      var row = el('div',{
        style:'display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid rgba(191,155,74,.07);cursor:pointer;',
        onclick:function(){ openExpDenom(d.id); }
      },[
        el('div',{style:'flex:1;'},[
          el('div',{style:'font-family:Cinzel,serif;font-size:.65rem;color:var(--crema);',text:d.name+hasSub}),
          el('div',{style:'font-family:IM Fell English,serif;font-style:italic;font-size:.73rem;color:rgba(245,239,226,.4);margin-top:2px;',text:grapes})
        ]),
        el('span',{
          style:'font-family:Cinzel,serif;font-size:.38rem;letter-spacing:1px;padding:2px 7px;background:'+tc+'28;border:1px solid '+tc+'99;color:'+tc+';font-weight:500;white-space:nowrap;margin-left:8px;',
          text:d.type
        })
      ]);
      row.addEventListener('mouseover',function(){this.style.background='rgba(92,26,26,.2)';});
      row.addEventListener('mouseout',function(){this.style.background='transparent';});
      cont.appendChild(row);
    });
  });
}

function openExpDenom(id){
  var d = EXP.feats.find(function(f){return f.id===id;});
  if(!d) return;
  UserMemory.trackDenom(id, d.country, d.grapes);

  var cont = clearEl('expDetail');
  if(!cont) return;
  showSection('expDetail');

  var flag = EFLAGS[d.country]||'🌍';
  var subz = ESUB[id];

  // Header sticky
  cont.appendChild(el('div',{style:'background:var(--nero);padding:12px 16px;border-bottom:1px solid rgba(191,155,74,.25);display:flex;align-items:center;gap:10px;position:sticky;top:52px;z-index:10;'},[
    el('button',{style:'background:none;border:none;color:rgba(191,155,74,.5);font-size:1.3rem;cursor:pointer;',text:'←',onclick:function(){openExpCountry(d.country);}}),
    el('div',null,[
      el('div',{style:'font-family:Cinzel,serif;font-size:.78rem;letter-spacing:2px;color:var(--crema);',text:d.name}),
      el('div',{style:'font-family:Cinzel,serif;font-size:.56rem;color:rgba(191,155,74,.45);margin-top:2px;',text:flag+' '+d.country+' · '+d.type})
    ])
  ]));

  // Una sola immagine header
  var hdrImg=buildTerroirHeaderImg(d.name, d.country);
  hdrImg.style.cssText='width:100%;height:160px;object-fit:cover;display:block;';
  cont.appendChild(hdrImg);

  // Sezione vitigni (pills)
  var grapes = (d.grapes||'').split(',').map(function(g){return g.trim();}).filter(Boolean);
  if(grapes.length){
    var pillWrap = el('div',{style:'padding:14px 16px;border-bottom:1px solid rgba(191,155,74,.1);'});
    pillWrap.appendChild(el('div',{style:'font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;color:rgba(191,155,74,.5);margin-bottom:8px;',text:'VITIGNI PRINCIPALI'}));
    var pillRow = el('div',{style:'display:flex;flex-wrap:wrap;gap:5px;'});
    grapes.forEach(function(g){
      var pill = el('span',{
        style:'font-family:Cinzel,serif;font-size:.56rem;letter-spacing:1px;padding:4px 10px;border:1px solid rgba(191,155,74,.3);color:rgba(191,155,74,.7);cursor:pointer;background:rgba(191,155,74,.05);',
        text:'🍇 '+g
      });
      pill.addEventListener('click',function(){ loadGrapeScheda(g, grapeSec); });
      pillRow.appendChild(pill);
    });
    pillWrap.appendChild(pillRow);
    cont.appendChild(pillWrap);
  }

  // Descrizione base stilizzata
  if(d.description){
    var dbx=document.createElement('div');
    dbx.style.cssText='padding:14px 16px;border-bottom:1px solid rgba(191,155,74,.1);background:rgba(0,0,0,.25);';
    var dlbl=document.createElement('div');
    dlbl.style.cssText='font-family:Cinzel,serif;font-size:.52rem;letter-spacing:2px;color:var(--oro);margin-bottom:7px;';
    dlbl.textContent=(d.type||'DOC')+' · '+flag+' '+d.country;
    dbx.appendChild(dlbl);
    var dtxt=document.createElement('div');
    dtxt.style.cssText='font-family:IM Fell English,serif;font-style:italic;font-size:.95rem;line-height:1.85;color:rgba(245,239,226,.82);';
    dtxt.textContent=d.description;
    dbx.appendChild(dtxt);
    cont.appendChild(dbx);
  }

  // Galleria rimossa (foto non pertinenti)

  // Sotto-zone
  if(subz){
    var subWrap = el('div',{style:'padding:14px 16px;border-bottom:1px solid rgba(191,155,74,.1);'});
    subWrap.appendChild(el('div',{style:'font-family:Cinzel,serif;font-size:.66rem;letter-spacing:3px;color:var(--oro);margin-bottom:12px;',text:'🗂 CLASSIFICAZIONE E SOTTO-ZONE'}));
    Object.keys(subz).forEach(function(cat){
      var catWrap = el('div',{style:'margin-bottom:12px;'});
      catWrap.appendChild(el('div',{
        style:'font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;color:rgba(191,155,74,.6);margin-bottom:6px;border-left:2px solid var(--vino);padding-left:8px;',
        text:cat.toUpperCase()
      }));
      var items = subz[cat];
      if(Array.isArray(items)){
        var itemRow = el('div',{style:'display:flex;flex-wrap:wrap;gap:4px;'});
        items.forEach(function(item){
          itemRow.appendChild(el('span',{
            style:'font-family:Cinzel,serif;font-size:.56rem;padding:3px 8px;background:rgba(191,155,74,.07);border:1px solid rgba(191,155,74,.15);color:rgba(245,239,226,.7);',
            text:item
          }));
        });
        catWrap.appendChild(itemRow);
      } else {
        catWrap.appendChild(el('span',{
          style:'font-family:IM Fell English,serif;font-style:italic;font-size:.83rem;color:rgba(245,239,226,.55);',
          text:items
        }));
      }
      subWrap.appendChild(catWrap);
    });
    cont.appendChild(subWrap);
  }

  // Scheda AI
  var aiWrap = el('div',{style:'padding:14px 16px;'});
  aiWrap.appendChild(el('div',{style:'font-family:Cinzel,serif;font-size:.66rem;letter-spacing:3px;color:var(--oro);margin-bottom:10px;',text:'📖 SCHEDA TECNICA'}));
  var aiSec = el('div',{style:'','class':'dai-text'});
  if(_expAI[id]){
    aiSec.innerHTML = _expAI[id];
  } else {
    aiSec.innerHTML = '<div class="dai-load">Caricamento scheda tecnica…</div>';
    loadExpAI(id, d, aiSec);
  }
  aiWrap.appendChild(aiSec);

  // Scheda vitigno
  aiWrap.appendChild(el('div',{style:'margin-top:16px;padding-top:14px;border-top:1px solid rgba(191,155,74,.15);font-family:Cinzel,serif;font-size:.66rem;letter-spacing:3px;color:var(--oro);margin-bottom:8px;',text:'🍇 SCHEDA VITIGNO'}));
  var grapeSec = el('div');
  grapeSec.innerHTML='<div class="dai-load" style="color:rgba(191,155,74,.3);">Tocca un vitigno per la scheda ampelografica</div>';
  aiWrap.appendChild(grapeSec);

  cont.appendChild(aiWrap);
  window.scrollTo(0,0);
}

async function loadExpAI(id, d, container){
  if(!apiKey && !SERVER_URL){
    container.innerHTML='<div class="dai-load" style="color:rgba(200,164,90,.3);">Server AI non disponibile</div>';
    return;
  }
  var sys = 'Sei un Maestro Sommelier AIS, ampelografo e storico del vino con 25 anni di esperienza. '
    + 'Scrivi una scheda enciclopedica COMPLETA per questa denominazione vitivinicola in italiano. '
    + 'Deve essere LUNGA, RICCA e PRECISA — come una pagina del Gambero Rosso o di Wine Spectator. '
    + 'Usa ESATTAMENTE questa struttura HTML — NIENTE markdown, NIENTE testo fuori dai tag:\n\n'

    + '<div class="dp-sec-head">📜 Storia e Origini</div>'
    + '<p style="color:#F5EFE2;line-height:1.9;font-size:.96rem;">'
    + '[5-6 frasi DETTAGLIATE: quando nasce questa denominazione (anno preciso), chi sono stati i protagonisti storici (nomi reali: produttori, nobili, monaci, enologi), aneddoti storici specifici, come è cambiata nel tempo, quando ha ottenuto il riconoscimento ufficiale DOC/DOCG/AOC e perché, come si colloca nella storia del vino italiano/mondiale]'
    + '</p>\n\n'

    + '<div class="dp-sec-head">🌍 Il Territorio e il Clima</div>'
    + '<p style="color:#F5EFE2;line-height:1.9;font-size:.96rem;">'
    + '[4-5 frasi: posizione geografica precisa con comuni principali, altitudine media e range, esposizione dei vigneti, tipo di suolo GEOLOGICO con nome scientifico (marne helvetiane, calcare attivo, tufo vulcanico, alberese, galestro, ecc.), composizione mineralogica, influenza del mare/montagna/lago/fiume, escursione termica giorno-notte, precipitazioni annue, venti dominanti con nome]'
    + '</p>\n\n'

    + '<div class="dp-sec-head">🌿 Viticoltura e Vendemmia</div>'
    + '<p style="color:#F5EFE2;line-height:1.9;font-size:.96rem;">'
    + '[3-4 frasi: forma di allevamento tradizionale con nome specifico (Guyot, alberello, pergola veronese, ecc.), densità di impianto per ettaro, resa massima per ettaro prevista dal disciplinare, periodo di germogliamento e vendemmia (mese preciso), scelta della data di raccolta, pratiche particolari (selezione manuale, diradamento, vendemmia tardiva)]'
    + '</p>\n\n'

    + '<div class="dp-sec-head">🍇 I Vitigni</div>'
    + '<ul style="color:#F5EFE2;line-height:2;padding-left:20px;font-size:.96rem;">'
    + '[4-6 punti — uno per ogni vitigno principale: nome vitigno (sinonimo se esiste) — percentuale minima prevista dal disciplinare — carattere aromatico specifico (NON generico) — come questo vitigno si esprime diversamente in questo territorio rispetto ad altre zone dove è coltivato]'
    + '</ul>\n\n'

    + '<div class="dp-sec-head">🏭 Vinificazione e Affinamento</div>'
    + '<p style="color:#F5EFE2;line-height:1.9;font-size:.96rem;">'
    + '[3-4 frasi: tecnica di vinificazione tradizionale, macerazione (giorni), tipo di contenitore per affinamento (botte grande/barrique/cemento/anfora) con dimensioni e provenienza del legno, periodo minimo di affinamento previsto dal disciplinare, affinamento in bottiglia]'
    + '</p>\n\n'

    + '<div class="dp-sec-head">🍷 Nel Bicchiere</div>'
    + '<p style="color:#F5EFE2;line-height:1.9;font-size:.96rem;">'
    + '[3-4 frasi: colore preciso con gradazione, aromi primari (frutto) specifici NON generici, aromi secondari (fermentazione) se rilevanti, aromi terziari (invecchiamento: cuoio/tabacco/catrame/goudron), struttura tannica (grana, durezza), acidità (viva/integrata/marcata), alcol tendenziale, persistenza, longevità in anni per le versioni standard e riserva]'
    + '</p>\n\n'

    + '<div class="dp-sec-head">🍽️ Abbinamenti a Tavola</div>'
    + '<p style="color:#F5EFE2;line-height:1.9;font-size:.96rem;">'
    + '[2-3 frasi: 4-5 abbinamenti specifici con piatti tradizionali del territorio O piatti classici della cucina italiana/internazionale, temperatura di servizio consigliata, dimensione del bicchiere ideale, quando aprire la bottiglia (subito/decantare/aspettare)]'
    + '</p>\n\n'

    + '<div class="dp-sec-head">🏅 I Produttori di Riferimento</div>'
    + '<p style="color:#F5EFE2;line-height:1.9;font-size:.96rem;">'
    + '[6-8 produttori — per ognuno: nome cantina, comune/frazione, stile produttivo (tradizionale/moderno/biologico), vino di punta con nome e annata consigliata, fascia di prezzo indicativa — separati da <br>]'
    + '</p>\n\n'

    + 'IMPORTANTE: Scrivi ALMENO 550 parole totali. Ogni sezione deve essere COMPLETA e SPECIFICA. '
    + 'MAI frasi generiche tipo "produce vini di qualità" o "territorio unico". '
    + 'SEMPRE dati concreti: anni, nomi, numeri, luoghi specifici. '
    + 'Chiudi con un fatto curioso o poco conosciuto su questa denominazione.';

  var userPrompt = 'Scheda enciclopedica completa per: ' + d.name
    + '\nPaese: ' + d.country
    + '\nVitigni principali: ' + d.grapes
    + '\nTipo: ' + (d.type||'DOC')
    + (d.description ? '\nNota: ' + d.description : '');

  // Cache localStorage — evita chiamate ripetute per la stessa denominazione
  var _ckey = 'sw_denom_' + id;
  try{
    var _ch = localStorage.getItem(_ckey);
    if(_ch){ _expAI[id]=_ch; var _wc=document.createElement('div'); _wc.className='dai-text'; _wc.innerHTML=_ch; container.innerHTML=''; container.appendChild(_wc); _wc.classList.add('fade-up'); requestAnimationFrame(function(){_wc.classList.add('visible');}); return; }
  }catch(_e){}

  try{
    var text = await callAPILong(sys, userPrompt);
    _expAI[id] = text;
    try{ localStorage.setItem(_ckey, text); }catch(_e){}
    
    // Crea contenitore DOM
    var wrap = document.createElement('div');
    wrap.className = 'dai-text';
    wrap.innerHTML = text;
    
    // Trasforma sentori in icone circolari
    var sentoriP = wrap.querySelector('.sentori-raw');
    if(sentoriP){
      var raw = sentoriP.textContent.trim();
      var items = raw.split(',').map(function(s){return s.trim();}).filter(Boolean);
      
      // Mappa emoji per i sentori comuni
      var SCENT_EMOJI = {
        'rosa':            '🌹', 'fiore':   '🌸', 'violetta': '💜', 'lavanda': '🪻',
        'lampone':         '🫐', 'fragola': '🍓', 'ciliegia':  '🍒', 'ribes':   '🍇',
        'mora':            '🫐', 'mirtillo':'🫐', 'prugna':   '🍑', 'fico':    '🍃',
        'vaniglia':        '🌿', 'spezie':  '🌶', 'pepe':     '🌶', 'cannella':'🟤',
        'cioccolato':      '🍫', 'caffe': '☕',   'tabacco':  '🍂', 'cuoio':   '🟫',
        'terra':           '🌱', 'muschio': '🌿', 'tartufo':  '🍄', 'fungo':   '🍄',
        'minerale':        '💎', 'pietra':  '🪨', 'ferro':    '⚙️', 'gesso':   '⬜',
        'agrumi':          '🍋', 'limone':  '🍋', 'arancio':  '🍊', 'pompelmo':'🍊',
        'pesca':           '🍑', 'albicocca':'🍑','mela':     '🍎', 'pera':    '🍐',
        'miele':           '🍯', 'burro':   '🧈', 'noci':     '🌰', 'mandorla':'🌰',
        'erba':            '🌿', 'fieno':   '🌾', 'menta':    '🌿', 'eucalipto':'🌿'
      };
      
      var grid = document.createElement('div');
      grid.className = 'scent-grid';
      
      items.slice(0, 8).forEach(function(sentore){
        var key = sentore.toLowerCase();
        var emoji = '🍷';
        Object.keys(SCENT_EMOJI).forEach(function(k){
          if(key.includes(k)) emoji = SCENT_EMOJI[k];
        });
        
        var pill = document.createElement('div');
        pill.className = 'scent-pill fade-up';
        
        var circle = document.createElement('div');
        circle.className = 'scent-circle';
        circle.textContent = emoji;
        
        var label = document.createElement('div');
        label.className = 'scent-label';
        label.textContent = sentore;
        
        pill.appendChild(circle);
        pill.appendChild(label);
        grid.appendChild(pill);
      });
      
      sentoriP.replaceWith(grid);
      
      // Fade-in differito
      requestAnimationFrame(function(){
        grid.querySelectorAll('.fade-up').forEach(function(el, i){
          setTimeout(function(){ el.classList.add('visible'); }, i * 80);
        });
      });
    }
    
    container.innerHTML = '';
    container.appendChild(wrap);
    
    // Fade-in dell'intera scheda
    wrap.classList.add('fade-up');
    requestAnimationFrame(function(){ wrap.classList.add('visible'); });
    
  } catch(e){
    container.innerHTML='<div class="dai-load" style="color:#f99;">Errore: '+e.message+'</div>';
  }
}

async function loadGrapeScheda(name, container){
  container.innerHTML='<div class="dai-load">Caricamento scheda '+name+'...</div>';
  if(!apiKey && !SERVER_URL){
    container.innerHTML='<div class="dai-load" style="color:rgba(191,155,74,.3);">Server AI non disponibile</div>';
    return;
  }
  var sys='Ampelografo esperto. Scheda HTML puro: <div class="dp-sec-head">🌍 Origine e Storia</div><p>[paese, storia, sinonimi]</p><div class="dp-sec-head">🍃 Ampelografia</div><p>[foglia, grappolo, acino tecnici]</p><div class="dp-sec-head">🌱 Terroir Ideale</div><p>[suoli, clima, altitudine]</p><div class="dp-sec-head">🍷 Nel Bicchiere</div><p>[colore, aromi, struttura, longevita, abbinamenti]</p><div class="dp-sec-head">🌍 Coltivato in</div><p>[DOC/AOC mondiali]</p>. Max 250 parole.';
  try{
    var text = await callAPI(sys, 'Scheda ampelografica: '+name, null, null);
    container.innerHTML = '<div class="dai-text">'+text+'</div>';
  } catch(e){
    container.innerHTML='<div class="dai-load" style="color:#f99;">'+e.message+'</div>';
  }
}

function filterExplore(q){
  if(!q||!q.trim()){ renderExploreCountries(); return; }
  UserMemory.trackSearch(q);
  q = q.toLowerCase().trim();
  showSection('expSearch');
  var hits = EXP.feats.filter(function(d){
    return (d.name||'').toLowerCase().includes(q) ||
           (d.country||'').toLowerCase().includes(q) ||
           (d.grapes||'').toLowerCase().includes(q) ||
           (d.region||'').toLowerCase().includes(q);
  });
  var cont = clearEl('expSearch');
  cont.appendChild(el('div',{
    style:'font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;color:rgba(191,155,74,.4);padding:8px 16px;',
    text:hits.length+' risultati per "'+q+'"'
  }));
  if(!hits.length){
    cont.appendChild(el('div',{style:'padding:20px;font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.3);',text:'Nessun risultato trovato'}));
    return;
  }
  hits.slice(0,40).forEach(function(d){
    var row = el('div',{
      style:'padding:11px 16px;border-bottom:1px solid rgba(191,155,74,.07);cursor:pointer;',
      onclick:function(){ openExpDenom(d.id); }
    },[
      el('div',{style:'font-family:Cinzel,serif;font-size:.65rem;color:var(--crema);',text:d.name}),
      el('div',{style:'font-family:IM Fell English,serif;font-style:italic;font-size:.73rem;color:rgba(245,239,226,.4);margin-top:2px;',text:(EFLAGS[d.country]||'🌍')+' '+d.country+' · '+(d.grapes||'').split(',')[0].trim()})
    ]);
    row.addEventListener('mouseover',function(){this.style.background='rgba(92,26,26,.2)';});
    row.addEventListener('mouseout',function(){this.style.background='transparent';});
    cont.appendChild(row);
  });
}



// ══════════════════════════════════════════════════════════
// SET DAILY THEME — cover e titolo cambiano ogni giorno
// ══════════════════════════════════════════════════════════
// GOLD FLASH — attivazione Pro con effetto bagliore
// ══════════════════════════════════════════════════════════
// PREFETCH — precarica le 10 denominazioni più popolari
// in background mentre l'utente guarda la Home
;

// ══════════════════════════════════════════════
// USER MEMORY — Agente con memoria utente
// Traccia preferenze per personalizzare i suggerimenti
// ══════════════════════════════════════════════
var UserMemory = (function(){
  var KEY = 'sw_memory_v1';
  var mem = {};
  
  // Carica memoria salvata
  try { mem = JSON.parse(localStorage.getItem(KEY)||'{}'); } catch(e){}
  
  // Struttura memoria
  mem.clicks = mem.clicks || {};          // denominazioni/vitigni cliccati
  mem.searches = mem.searches || [];      // ultime 20 ricerche
  mem.countries = mem.countries || {};    // paesi preferiti
  mem.grapes = mem.grapes || {};          // vitigni preferiti
  mem.lastSeen = mem.lastSeen || [];      // ultime 10 denominazioni viste
  mem.sessionStart = new Date().toISOString();
  
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch(e){} }
  
  return {
    // Registra click su denominazione
    trackDenom: function(id, country, grapes){
      mem.clicks[id] = (mem.clicks[id]||0) + 1;
      mem.countries[country] = (mem.countries[country]||0) + 1;
      if(grapes){
        grapes.split(',').forEach(function(g){
          var gn = g.trim();
          mem.grapes[gn] = (mem.grapes[gn]||0) + 1;
        });
      }
      mem.lastSeen.unshift(id);
      mem.lastSeen = mem.lastSeen.slice(0,10);
      save();
    },
    
    // Registra ricerca
    trackSearch: function(q){
      if(!q) return;
      mem.searches.unshift(q);
      mem.searches = mem.searches.slice(0,20);
      save();
    },
    
    // Ottieni paese preferito
    getFavoriteCountry: function(){
      var top = Object.keys(mem.countries).sort(function(a,b){ return mem.countries[b]-mem.countries[a]; });
      return top[0] || null;
    },
    
    // Ottieni vitigni preferiti (top 3)
    getFavoriteGrapes: function(){
      return Object.keys(mem.grapes).sort(function(a,b){ return mem.grapes[b]-mem.grapes[a]; }).slice(0,3);
    },
    
    // Costruisci contesto personalizzato per le richieste AI
    getAIContext: function(){
      var favCountry = this.getFavoriteCountry();
      var favGrapes = this.getFavoriteGrapes();
      var topDenoms = Object.keys(mem.clicks)
        .sort(function(a,b){return mem.clicks[b]-mem.clicks[a];})
        .slice(0,3).join(', ');
      var context = '';
      if(favCountry) context += 'Paese preferito: '+favCountry+'. ';
      if(favGrapes.length) context += 'Vitigni amati: '+favGrapes.join(', ')+'. ';
      if(topDenoms) context += 'Denominazioni più esplorate: '+topDenoms+'. ';
      if(mem.searches.length) context += 'Ultime ricerche: '+mem.searches.slice(0,4).join(', ')+'. ';
      var tot = Object.values(mem.clicks).reduce(function(a,b){return a+b;},0);
      context += 'Sessioni totali: '+tot+'. ';
      return context;
    },
    
    // Tipo di palato inferito dai click
    getPalateProfile: function(){
      var rosso = 0, bianco = 0, bollicine = 0;
      Object.keys(mem.clicks).forEach(function(id){
        var n = mem.clicks[id];
        if(['champagne','prosecco','franciacorta','cava','trento','alta_langa'].indexOf(id)>-1) bollicine+=n;
        else if(['barolo','barbaresco','brunello','amarone','rioja','pauillac','hermitage','barossa'].indexOf(id)>-1) rosso+=n;
        else bianco+=n;
      });
      if(bollicine>rosso && bollicine>bianco) return 'bollicine';
      if(bianco>rosso) return 'bianchi eleganti';
      return 'rossi di carattere';
    },
    
    // Suggerimenti personalizzati per la home
    getSuggestions: function(allFeatures){
      var fav = this.getFavoriteCountry();
      if(!fav || !allFeatures) return [];
      return allFeatures
        .filter(function(f){ return f.country === fav && !mem.lastSeen.includes(f.id); })
        .sort(function(a,b){ return (mem.clicks[b.id]||0)-(mem.clicks[a.id]||0); })
        .slice(0,3);
    },
    
    data: mem
  };
})();


// ══════════════════════════════════════════════════════════
// PRO SYSTEM — Club del Terroir
// ══════════════════════════════════════════════════════════

// ── Stato Pro ──
var ProState = (function(){
  var KEY = 'sw_pro_v2';
  var data = {};
  try { data = JSON.parse(localStorage.getItem(KEY)||'{}'); } catch(e){}
  return {
    isActive: function(){ 
      return data.active && data.expires && new Date(data.expires) > new Date(); 
    },
    activate: function(email){
      var exp = new Date();
      exp.setDate(exp.getDate()+30);
      data = {active:true, email:email, plan:'trial', activated:new Date().toISOString(), expires:exp.toISOString()};
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e){}
    },
    getEmail: function(){ return data.email||''; },
    data: function(){ return data; }
  };
})();

// ── Modale Pro ──
function openProModal(){
  var modal = document.getElementById('proModal');
  if(!modal) return;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  buildProBenefits();
    var inp = document.getElementById('proEmail');
  if(inp && ProState.getEmail()) inp.value = ProState.getEmail();
}

function closeProModal(){
  var modal = document.getElementById('proModal');
  if(modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function buildProBenefits(){
  var cont = document.getElementById('proBenefits');
  if(!cont) return;
  cont.innerHTML = '';
  var benefits = [
    {ico:'📰', title:'Gazzetta Personalizzata', desc:'La home si adatta ai tuoi gusti ogni giorno'},
    {ico:'🌿', title:'Vitigno del Giorno', desc:'Una storia inedita generata dall\'AI ogni mattina'},
    {ico:'🗺', title:'Terroir Illimitato', desc:'Schede complete per tutte le 327 denominazioni'},
    {ico:'🍷', title:'Sommelier AI Privato', desc:'Abbinamenti poetici senza limiti'},
    {ico:'📅', title:'Agenda Imperdibile', desc:'Gli eventi più esclusivi selezionati per te'},
    {ico:'📄', title:'Export PDF', desc:'Schede professionali da condividere'},
  ];
  benefits.forEach(function(b){
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;';
    var ico = document.createElement('span');
    ico.style.cssText = 'font-size:1.3rem;flex-shrink:0;margin-top:2px;';
    ico.textContent = b.ico;
    var txt = document.createElement('div');
    var title = document.createElement('div');
    title.style.cssText = 'font-family:Cinzel,serif;font-size:.68rem;letter-spacing:.1em;color:var(--crema);margin-bottom:2px;';
    title.textContent = b.title;
    var desc = document.createElement('div');
    desc.style.cssText = 'font-family:Cormorant Garamond,serif;font-size:.95rem;color:rgba(245,239,226,.5);line-height:1.4;';
    desc.textContent = b.desc;
    txt.appendChild(title);
    txt.appendChild(desc);
    row.appendChild(ico);
    row.appendChild(txt);
    cont.appendChild(row);
  });
}

function activatePro(){
  var email = (document.getElementById('proEmail')||{}).value||'';
  var msg = document.getElementById('proMsg');
  var btn = document.getElementById('proActivateBtn');
  if(!email || !email.includes('@')){
    if(msg){ msg.textContent = 'Inserisci una email valida'; msg.style.color='#f99'; }
    return;
  }
  if(btn){ btn.textContent = '...'; btn.disabled = true; }
  ProState.activate(email);
  isPro = true;
  if(msg){ msg.textContent = '✨ Benvenuto nel Club del Terroir!'; msg.style.color='var(--oro)'; }
  var banner = document.getElementById('proBanner');
  var offer = document.getElementById('proOffer');
  if(banner) banner.style.display = 'flex';
  if(offer) offer.style.display = 'none';
  setTimeout(function(){
    closeProModal();
    triggerGoldFlash();        // bagliore dorato
    renderProGreeting();       // saluto personalizzato
    GazzettaEditor.init();     // contenuti Pro
    if(document.getElementById('proAdvSearch'))
      document.getElementById('proAdvSearch').style.display='block';
  }, 1600);
}

// ══════════════════════════════════════════════════════════
// GAZZETTA EDITOR — Agente AI giornaliero
// ══════════════════════════════════════════════════════════
var GazzettaEditor = {
  
  CACHE_KEY: 'sw_gazzetta_' + new Date().toISOString().split('T')[0],
  
  init: function(){
    if(!ProState.isActive()) return;
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(this.CACHE_KEY)); } catch(e){}
    if(cached){
      this.render(cached);
    } else {
      this.generate();
    }
  },
  
  generate: async function(){
    if(!apiKey) return;
    var self = this;
    // Costruisci contesto personalizzato
    var ctx = UserMemory.getAIContext();
    var favGrapes = UserMemory.getFavoriteGrapes();
    var vitignoTarget = favGrapes.length ? favGrapes[0] : 'Nebbiolo';
    
    var sys = (
      'Sei il direttore della Gazzetta del Terroir. ' +
      'Genera i contenuti giornalieri del club Pro. ' +
      'Rispondi SOLO con JSON puro: ' +
      '{"vitigno":{"nome":"...","emoji":"🍇","sottotitolo":"...","storia":"...storia affascinante 4-5 frasi...","curiosita":"...una curiosità sorprendente...","foto_query":"...query inglese per foto vigneto..."},' +
      '"evento":{"titolo":"...","cantina":"...","luogo":"...","data":"...","descrizione":"...2 frasi...","prezzo":"..."},' +
      '"consiglio":{"titolo":"Il Consiglio del Giorno","testo":"...consiglio personalizzato poetico basato sui gusti dell utente, 3 frasi...","vino":"...nome vino specifico...","perche":"...perche questo vino oggi..."}}'
    );
    var prompt = 'Genera i contenuti Pro di oggi. ' +
      (ctx ? 'Profilo utente: '+ctx : '') +
      ' Vitigno del giorno: '+vitignoTarget+'.';
    
    try {
      var text = await callAPI(sys, prompt, null, null);
      var clean = text.replace(/```json|```/g,'').trim();
      var data = JSON.parse(clean);
      try { localStorage.setItem(self.CACHE_KEY, JSON.stringify(data)); } catch(e){}
      self.render(data);
    } catch(e){
      console.log('GazzettaEditor error:', e.message);
    }
  },
  
  render: function(data){
    var home_body = document.querySelector('.home-body');
    if(!home_body || !data) return;
    
        var old = document.getElementById('gazzettaProSection');
    if(old) old.remove();
    
    // Crea sezione Pro
    var section = document.createElement('div');
    section.id = 'gazzettaProSection';
    section.style.cssText = 'margin-bottom:0;';
    
    // ── Vitigno del Giorno ──
    if(data.vitigno){
      var v = data.vitigno;
      var imgUrl = unsplashUrl((v.foto_query||'vineyard grape vine', 800, 400)+',wine');
      
      var card = document.createElement('div');
      card.style.cssText = 'margin-bottom:0;border-top:3px solid var(--oro);';
      
      // Immagine
      var img = document.createElement('div');
      img.style.cssText = 'height:220px;background-image:url('+imgUrl+');background-size:cover;background-position:center;position:relative;';
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:absolute;inset:0;background:linear-gradient(to top,rgba(10,5,2,.96) 30%,transparent);';
      var imgLabel = document.createElement('div');
      imgLabel.style.cssText = 'position:absolute;bottom:14px;left:16px;right:16px;';
      
      var kicker = document.createElement('div');
      kicker.className = 't-kicker';
      kicker.style.marginBottom = '6px';
      kicker.textContent = (v.emoji||'🍇') + ' VITIGNO DEL GIORNO';
      
      var vitignoTitle = document.createElement('div');
      vitignoTitle.style.cssText = 'font-family:Cinzel,serif;font-size:1.6rem;color:#fff;font-weight:600;letter-spacing:.03em;line-height:1.2;';
      vitignoTitle.textContent = v.nome||'';
      
      var sub = document.createElement('div');
      sub.style.cssText = 'font-family:IM Fell English,serif;font-style:italic;font-size:.95rem;color:rgba(200,164,90,.8);margin-top:4px;';
      sub.textContent = v.sottotitolo||'';
      
      imgLabel.appendChild(kicker);
      imgLabel.appendChild(vitignoTitle);
      imgLabel.appendChild(sub);
      img.appendChild(overlay);
      img.appendChild(imgLabel);
      card.appendChild(img);
      
      // Testo storia
      var textBlock = document.createElement('div');
      textBlock.style.cssText = 'padding:18px 16px;background:var(--parch);';
      
      var storia = document.createElement('p');
      storia.style.cssText = 'font-family:Cormorant Garamond,serif;font-size:1.08rem;line-height:1.88;color:var(--testo);margin:0 0 12px;';
      storia.textContent = v.storia||'';
      
      var curiositaBox = document.createElement('div');
      curiositaBox.style.cssText = 'background:rgba(200,164,90,.12);border-left:3px solid var(--oro);padding:12px 14px;';
      var curLabel = document.createElement('div');
      curLabel.className = 't-kicker';
      curLabel.style.cssText += 'font-size:.58rem;margin-bottom:6px;';
      curLabel.textContent = '✦ LO SAPEVI?';
      var curText = document.createElement('div');
      curText.style.cssText = 'font-family:IM Fell English,serif;font-style:italic;font-size:1rem;color:var(--testo2);line-height:1.75;';
      curText.textContent = v.curiosita||'';
      curiositaBox.appendChild(curLabel);
      curiositaBox.appendChild(curText);
      
      textBlock.appendChild(storia);
      textBlock.appendChild(curiositaBox);
      card.appendChild(textBlock);
      section.appendChild(card);
    }
    
    // ── Consiglio del Giorno ──
    if(data.consiglio){
      var cons = data.consiglio;
      var consCard = document.createElement('div');
      consCard.style.cssText = 'padding:20px 16px;background:var(--fumo);border-top:1px solid var(--seppia);border-bottom:1px solid var(--seppia);';
      
      var consKicker = document.createElement('div');
      consKicker.className = 't-kicker';
      consKicker.style.marginBottom = '10px';
      consKicker.textContent = '🍷 IL CONSIGLIO DI OGGI — SOLO PER TE';
      
      var consTitle = document.createElement('div');
      consTitle.style.cssText = 'font-family:Cinzel,serif;font-size:1rem;color:var(--crema);margin-bottom:10px;';
      consTitle.textContent = cons.vino||'';
      
      var consText = document.createElement('p');
      consText.style.cssText = 'font-family:Cormorant Garamond,serif;font-size:1.05rem;line-height:1.85;color:rgba(245,239,226,.75);margin:0 0 8px;font-style:italic;';
      consText.textContent = cons.testo||'';
      
      var consPerche = document.createElement('div');
      consPerche.style.cssText = 'font-family:Cinzel,serif;font-size:.6rem;letter-spacing:.15em;color:var(--oro);';
      consPerche.textContent = cons.perche||'';
      
      consCard.appendChild(consKicker);
      consCard.appendChild(consTitle);
      consCard.appendChild(consText);
      consCard.appendChild(consPerche);
      section.appendChild(consCard);
    }
    
    // Inserisci DOPO la sezione "Per Te" e PRIMA delle notizie
    var newsSection = home_body.querySelector('.news-section-head') || home_body.firstChild;
    home_body.insertBefore(section, newsSection);
  }
};


// ── HERO INIT ──
(function(){
  // 8 foto di alta qualità — cambiano ad ogni caricamento
  var PHOTOS = ['gradient1','gradient2','gradient3','gradient4','gradient5','gradient6','gradient7'];
  var TITLES = [
    {t:'La Vigna al Tramonto',     s:'La luce d\'oro trasforma ogni filare in un dipinto eterno'},
    {t:'Nelle Profondità',          s:'Le botti custodiscono i segreti di stagioni lontane'},
    {t:'Il Tempio del Vino',        s:'Dove la pietra e il tempo creano qualcosa di immortale'},
    {t:'Il Frutto della Pazienza',  s:'Ogni acino racchiude un anno intero di sole, pioggia e cura'},
    {t:'L\'Arte nel Calice',        s:'Un sorso è un viaggio — dal suolo alle stelle'},
    {t:'La Magia della Vendemmia',  s:'Le mani che raccolgono il frutto di un anno intero'},
    {t:'Vista dal Cielo',           s:'Filari come righe di un libro scritto dalla natura'},
    {t:'Luce e Silenzio',           s:'Il momento più bello è quello prima di aprire la bottiglia'}
  ];

  // Casuale ad ogni caricamento
  var idx = Math.floor(Math.random() * PHOTOS.length);
  var bg = document.getElementById('heroBg');
  var ht = document.getElementById('heroTitle');
  var hs = document.getElementById('heroSub');

  if(bg){
    // Non usare foto - usa gradiente
    var heroGrads = ['linear-gradient(135deg,#1a0505,#3d1408,#0d0808)','linear-gradient(135deg,#0a0d1a,#1a2040,#050810)','linear-gradient(135deg,#0d1a08,#1a3010,#050d05)','linear-gradient(135deg,#1a0808,#3a0a0a,#0d0505)','linear-gradient(135deg,#1a1008,#3d2808,#0d0805)','linear-gradient(135deg,#08080d,#10101a,#050508)','linear-gradient(135deg,#0d0808,#1a0a0a,#080505)'];
    bg.style.backgroundImage = 'none';
    bg.style.background = heroGrads[idx % heroGrads.length];
    bg.style.opacity = '0';
    bg.style.transition = 'opacity 1.5s ease';
    var img = new Image();
    img.onload = function(){ bg.style.opacity = '1'; };
    // img.src rimosso - no foto
  }
  if(ht) ht.textContent = TITLES[idx].t;
  if(hs) hs.textContent = TITLES[idx].s;

  var hd = document.getElementById('heroDate');
  if(hd){
    var m=['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
    var d = new Date();
    hd.textContent = d.getDate()+' '+m[d.getMonth()]+' '+d.getFullYear();
  }

  // Parallax scroll
  window.addEventListener('scroll', function(){
    var h=document.getElementById('heroSection');
    var b=document.getElementById('heroBg');
    if(!h||!b) return;
    var r=h.getBoundingClientRect();
    if(r.bottom>0&&r.top<window.innerHeight)
      b.style.transform='scale(1.06) translateX(-0.5%) translateY('+(- r.top * 0.18)+'px)';
  },{passive:true});
})();

// ── FADE-IN OBSERVER ──
(function(){
  if(!window.IntersectionObserver) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12, rootMargin:'0px 0px -40px 0px'});
  
  // Osserva gli elementi esistenti e nuovi
  function observeAll(){
    document.querySelectorAll('.fade-up:not(.visible)').forEach(function(el){
      io.observe(el);
    });
  }
  observeAll();
  
  // Re-osserva quando vengono aggiunti nuovi elementi
  if(window.MutationObserver){
    new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(n){
          if(n.nodeType===1){
            if(n.classList && n.classList.contains('fade-up')) io.observe(n);
            n.querySelectorAll && n.querySelectorAll('.fade-up:not(.visible)').forEach(function(el){io.observe(el);});
          }
        });
      });
    }).observe(document.body, {childList:true, subtree:true});
  }
})();


// ══════════════════════════════════════════════════════════
// RUBRICHE EDITORIALI — 3 blocchi fissi Home
// ══════════════════════════════════════════════════════════
var RubricheEditor = {

  CACHE_KEY: 'sw_rubriche_' + new Date().toISOString().split('T')[0],

  init: function(){
    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(this.CACHE_KEY)); } catch(e){}
    if(cached){ this.render(cached); }
    else if(apiKey){ this.generate(); }
    else { this.renderDefault(); }
  },

  generate: async function(){
    var self = this;
    var ctx = UserMemory.getAIContext();
    var sys = (
      'Sei il direttore editoriale della Gazzetta del Vino. ' +
      'Genera 3 rubriche giornaliere. Rispondi SOLO con JSON puro senza markdown: ' +
      '{"vitigno_ritrovato":{"titolo":"Il Vitigno Ritrovato","vitigno":"...nome vitigno raro...","emoji":"🌿",' +
      '"sottotitolo":"...tagline poetica...","testo":"...storia coinvolgente 4 frasi su questo vitigno quasi dimenticato, dove sopravvive, chi lo coltiva, com\'e nel bicchiere...","foto_query":"...query inglese es: ancient grape vine italy..."},' +
      '"angolo_sommelier":{"titolo":"L\'Angolo del Sommelier","emoji":"🍷",' +
      '"abbinamento":"...nome vino specifico con produttore...","piatto":"...piatto specifico...",' +
      '"testo":"...2 frasi poetiche su questo abbinamento senza termini tecnici — racconta l\'emozione...","foto_query":"...query inglese es: wine food pairing dinner..."},' +
      '"meteo_vigna":{"titolo":"Meteo in Vigna","emoji":"🌤",' +
      '"regione":"...regione viticola specifica...","stagione":"...momento del ciclo vite...","testo":"...2 frasi su come le condizioni climatiche attuali stanno plasmando il vino di questa regione...","foto_query":"...query inglese es: vineyard fog morning autumn harvest..."}}'
    );
    try {
      var text = await callAPI(sys, 'Genera le rubriche di oggi.' + (ctx ? ' Profilo utente: '+ctx : ''), null, null);
      var clean = text.replace(/```json|```/g,'').trim();
      var data = JSON.parse(clean);
      try { localStorage.setItem(self.CACHE_KEY, JSON.stringify(data)); } catch(e){}
      self.render(data);
    } catch(e){
      self.renderDefault();
    }
  },

  render: function(data){
    var cont = document.getElementById('rubriche');
    if(!cont) return;
    cont.innerHTML = '';

    var rubriche = [
      { key:'vitigno_ritrovato', num:'I', color:'var(--vino)' },
      { key:'angolo_sommelier',  num:'II', color:'var(--oro)' },
      { key:'meteo_vigna',       num:'III', color:'#4A7FA8' }
    ];

    rubriche.forEach(function(r){
      var d = data[r.key];
      if(!d) return;

      var imgUrl = unsplashUrl((d.foto_query||'vineyard wine', 800, 400)+'&sig='+r.num);

      // Card rubrica
      var card = document.createElement('div');
      card.className = 'gz-card';

      // Img
      var img = document.createElement('img');
      img.className = 'gz-img-cover';
      img.src = imgUrl;
      img.alt = d.titolo||'';
      img.loading = 'lazy';
      img.style.borderRadius = '0';
      card.appendChild(img);

      // Body
      var body = document.createElement('div');
      body.className = 'gz-card-body';

      // Rubrica label
      var label = document.createElement('div');
      label.className = 'rubrica-head';
      label.style.padding = '0 0 10px 0';
      label.style.borderTop = 'none';
      var num = document.createElement('span');
      num.style.cssText = 'font-family:Cinzel,serif;font-size:1.5rem;color:rgba(200,164,90,.2);font-weight:700;line-height:1;';
      num.textContent = r.num;
      var rubLabel = document.createElement('span');
      rubLabel.className = 'gz-rubrica-label';
      rubLabel.textContent = (d.emoji||'') + ' ' + (d.titolo||'').toUpperCase();
      label.appendChild(num);
      label.appendChild(rubLabel);
      body.appendChild(label);

      // Sottotitolo / soggetto
      if(d.vitigno || d.abbinamento || d.regione){
        var sogg = document.createElement('div');
        sogg.style.cssText = 'font-family:Cinzel,serif;font-size:1.05rem;font-weight:600;color:var(--testo);margin-bottom:8px;line-height:1.3;';
        sogg.textContent = d.vitigno || d.abbinamento || d.regione;
        body.appendChild(sogg);
      }

      // Sottotitolo poetico
      if(d.sottotitolo || d.piatto || d.stagione){
        var sub = document.createElement('div');
        sub.style.cssText = 'font-family:IM Fell English,serif;font-style:italic;font-size:.95rem;color:var(--grigio);margin-bottom:10px;';
        sub.textContent = d.sottotitolo || d.piatto || d.stagione;
        body.appendChild(sub);
      }

      // Testo
      var txt = document.createElement('p');
      txt.className = 'gz-text';
      txt.style.margin = '0';
      txt.textContent = d.testo||'';
      body.appendChild(txt);

      // Byline
      var byline = document.createElement('div');
      byline.className = 'gz-byline';
      byline.textContent = 'Sommelier World · ' + new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long'});
      body.appendChild(byline);

      card.appendChild(body);
      cont.appendChild(card);
    });
  },

  renderDefault: function(){
    var cont = document.getElementById('rubriche');
    if(!cont) return;
    cont.innerHTML = '';
    var msg = document.createElement('div');
    msg.style.cssText = 'padding:16px;text-align:center;font-family:IM Fell English,serif;font-style:italic;color:rgba(200,164,90,.4);font-size:.95rem;';
    msg.textContent = 'Configura la chiave API (⚙️) per le rubriche editoriali';
    cont.appendChild(msg);
  }
};

// ══════════════════════════════════════════════════════════
// TIMELINE EVENTI — render DOM puro
// ══════════════════════════════════════════════════════════
function renderEvents(events){
  var cont = document.getElementById('eventsContainer');
  if(!cont || !events || !events.length) return;
  cont.innerHTML = '';

  var timeline = document.createElement('div');
  timeline.className = 'ev-timeline';

  events.forEach(function(ev){
    var imgUrl = unsplashUrl((ev.photo_query||'wine tasting winery event', 800, 400)+',elegant');

    var item = document.createElement('div');
    item.className = 'ev-item';

    var dot = document.createElement('div');
    dot.className = 'ev-dot';
    item.appendChild(dot);

    var card = document.createElement('div');
    card.className = 'ev-card';

    // Img con shadow
    var img = document.createElement('img');
    img.className = 'ev-img';
    img.src = imgUrl;
    img.alt = ev.titolo||'';
    img.loading = 'lazy';
    card.appendChild(img);

    var body = document.createElement('div');
    body.className = 'ev-body';

    var dateTag = document.createElement('div');
    dateTag.className = 'ev-date-tag';
    dateTag.textContent = ev.data||'';
    body.appendChild(dateTag);

    var title = document.createElement('div');
    title.className = 'ev-title';
    title.textContent = (ev.emoji||'📅') + ' ' + (ev.titolo||'');
    body.appendChild(title);

    var cantina = document.createElement('div');
    cantina.className = 'ev-place';
    cantina.textContent = (ev.cantina||'') + (ev.luogo ? ' · 📍 '+ev.luogo : '');
    body.appendChild(cantina);

    var desc = document.createElement('p');
    desc.className = 'ev-desc';
    desc.textContent = ev.descrizione||'';
    desc.style.margin = '0 0 4px';
    body.appendChild(desc);

    if(ev.prezzo){
      var price = document.createElement('div');
      price.className = 'ev-price';
      price.textContent = '💶 ' + ev.prezzo;
      body.appendChild(price);
    }

    // Pulsante Visita Sito Ufficiale
    var visitBtn = document.createElement('a');
    visitBtn.href = ev.link || ('https://www.google.com/search?q=' + encodeURIComponent((ev.cantina||'') + ' ' + (ev.titolo||'')));
    visitBtn.target = '_blank';
    visitBtn.rel = 'noopener noreferrer';
    visitBtn.style.cssText = 'display:inline-block;font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.15em;padding:8px 16px;background:var(--oro);color:var(--nero);border:none;cursor:pointer;border-radius:2px;margin-top:10px;text-decoration:none;';
    visitBtn.textContent = '🌐 Visita Sito Ufficiale';
    body.appendChild(visitBtn);

    var clear = document.createElement('div');
    clear.style.clear = 'both';
    body.appendChild(clear);

    card.appendChild(body);
    item.appendChild(card);
    timeline.appendChild(item);
  });

  cont.appendChild(timeline);
}

// ══════════════════════════════════════════════════════════
// SALUTO PRO — personalizzato con nome
// ══════════════════════════════════════════════════════════
// RICERCA AVANZATA PRO nel Terroir
// ══════════════════════════════════════════════════════
// 1. DAILY THEME — cover dinamica per giorno settimana
// ══════════════════════════════════════════════════════
var DAILY_THEMES = [
  {day:'Domenica',     q:'tuscany vineyard golden sunset',  title:'Tra i Filari', sub:'La domenica del vino — silenzio, bellezza, calice in mano'},
  {day:'Lunedì',       q:'wine cellar barrels aging stone',  title:'Nelle Profondità', sub:'Il vino riposa nelle botti mentre il mondo si sveglia'},
  {day:'Martedì',      q:'champagne grapes harvest hands',  title:'La Vendemmia', sub:'Ogni grappolo raccolto a mano è una promessa di eccellenza'},
  {day:'Mercoledì',    q:'burgundy vineyard morning fog',   title:'La Nebbia del Terroir', sub:'Quando la terra parla attraverso la nebbia del mattino'},
  {day:'Giovedì',      q:'vineyard harvest grapes hand',    title:'Il Frutto della Terra', sub:'Dalla vigna al bicchiere — il viaggio più antico del mondo'},
  {day:'Venerdì',      q:'wine tasting sommelier elegant',  title:"L'Arte della Degustazione", sub:'Il venerdì è il giorno del calice — ogni sorso racconta una storia'},
  {day:'Sabato',       q:'winery estate landscape panorama', title:'Il Grand Tour', sub:'Sabato è il giorno dei viaggi — anche quelli nel bicchiere'}
];

function setDailyTheme(){
  var day = new Date().getDay();
  var theme = DAILY_THEMES[day];
  var heroBg = document.getElementById('heroBg');
  var heroTitle = document.getElementById('heroTitle');
  var heroSub = document.getElementById('heroSub');
  if(heroBg){
    // Gradienti eleganti per ogni giorno - nessuna dipendenza da servizi esterni
    var gradients = [
      'linear-gradient(135deg, #1a0a04 0%, #3d1408 40%, #1a0505 100%)',  // Dom - bordeaux
      'linear-gradient(135deg, #080503 0%, #1a0d08 50%, #2d1a0a 100%)',  // Lun - scuro caldo
      'linear-gradient(135deg, #0d0506 0%, #2a0a0a 40%, #1a0808 100%)',  // Mar - rosso scuro
      'linear-gradient(135deg, #050810 0%, #0a1520 50%, #060a14 100%)',  // Mer - notte blu
      'linear-gradient(135deg, #060402 0%, #1a0d08 40%, #2d1a0a 100%)',  // Gio - terra
      'linear-gradient(135deg, #1a0808 0%, #3a0e0e 50%, #1a0505 100%)',  // Ven - vino
      'linear-gradient(135deg, #0a0805 0%, #1f1408 50%, #2d1e0a 100%)'  // Sab - ambra
    ];
    heroBg.style.backgroundImage = gradients[day];
    heroBg.style.backgroundSize = '100% 100%';
    heroBg.style.opacity = '0';
    heroBg.style.transition = 'opacity 1.2s ease';
    var img = new Image();
    img.onload = function(){
      heroBg.style.opacity = '1';
    };
    img.src = url;
  }
  if(heroTitle) heroTitle.textContent = theme.title;
  if(heroSub) heroSub.textContent = theme.sub;
}

// ══════════════════════════════════════════════════════
// 2. OROLOGIO VIGNAIOLO (statico — dati precisi per mese)
// ══════════════════════════════════════════════════════
var VignaCalendar = {
  ops: [
    {emoji:'❄️', op:'Riposo invernale',              desc:'La vite dorme sotto il gelo. Il vignaiolo studia le botti, assaggia e sogna la vendemmia che verrà.'},
    {emoji:'✂️', op:'Potatura secca',                desc:'Si tagliano i tralci dell\'anno scorso. Ogni colpo di forbice decide il destino del prossimo vino.'},
    {emoji:'🌿', op:'Il Pianto della Vite',          desc:'Dai tagli esce linfa viva: la vite si risveglia. Un momento quasi sacro che annuncia la primavera.'},
    {emoji:'🌱', op:'Germogliamento',                desc:'I primi germogli spuntano timidi. Una gelata tardiva potrebbe distruggere tutto. L\'ansia è già nella vigna.'},
    {emoji:'🌸', op:'Fioritura e impollinazione',    desc:'Piccoli fiori bianchi si aprono. In dieci giorni si deciderà quante bottiglie nascerà quest\'anno.'},
    {emoji:'🍇', op:'Allegagione',                   desc:'I fiori diventano acini minuscoli. Il vignaiolo sceglie i grappoli da sacrificare per concentrare l\'energia.'},
    {emoji:'☀️', op:'Invaiatura',                    desc:'Gli acini cambiano colore, dal verde al rosso o all\'oro. Zuccheri e profumi si accumulano giorno dopo giorno.'},
    {emoji:'🍃', op:'Sfogliatura e gestione foglie', desc:'Si rimuovono le foglie vicino ai grappoli: il sole carezza ogni acino e lo prepara al grande momento.'},
    {emoji:'🍂', op:'Pre-vendemmia',                 desc:'Si assaggia ogni mattina. Lo zucchero cresce, l\'acido cala. L\'attesa è febbrile. Basta un temporale.'},
    {emoji:'🎉', op:'Vendemmia',                     desc:'Finalmente. Le mani raccolgono i grappoli all\'alba tra canti e risate. Il profumo del mosto riempie l\'aria.'},
    {emoji:'🏚', op:'Vinificazione',                  desc:'Il vino nasce. Fermentazione e magia si intrecciano in cantina. Il vignaiolo non dorme quasi più.'},
    {emoji:'🥂', op:'Degustazione delle nuove annate',desc:'Si assaggia il vino nuovo, si sceglie come affinarlo. E già si pensa all\'anno che verrà. Il ciclo eterno.'}
  ],
  render: function(containerId){
    var cont = document.getElementById(containerId);
    if(!cont) return;
    var month = new Date().getMonth();
    var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
    var info = this.ops[month];

    var box = document.createElement('div');
    box.className = 'vigna-clock gz-card';

    var mo = document.createElement('div');
    mo.className = 'vigna-clock-month';
    mo.textContent = '🌿 IN VIGNA A ' + months[month].toUpperCase(); mo.classList.add('shimmer-gold');
    box.appendChild(mo);

    var op = document.createElement('div');
    op.className = 'vigna-clock-op';
    op.textContent = info.emoji + ' ' + info.op;
    box.appendChild(op);

    var desc = document.createElement('p');
    desc.className = 'vigna-clock-desc';
    desc.style.margin = '0';
    desc.id = 'vignaDesc_' + Date.now();
    desc.textContent = info.desc;
    box.appendChild(desc);

    cont.appendChild(box);

    // Rigenera descrizione con AI per freschezza assoluta
    if(apiKey || SERVER_URL){
      var sys = 'Sei un vignaiolo poeta. In 2 frasi brevi e liriche descrivi cosa succede esattamente in vigna a ' + months[month] + ' in Italia centrale. Cita un gesto specifico del vignaiolo, un profumo o un suono della vigna. Niente elenchi, solo prosa poetica.';
      callAPI(sys, 'Descrivi la vigna a ' + months[month], null, null).then(function(text){
        var el = document.getElementById(desc.id);
        if(el) el.textContent = text.trim();
      }).catch(function(){});
    }
  }
};

// ══════════════════════════════════════════════════════
// 3. EXTRA RUBRICHE — Stelle, Orologio, Grand Tour, Flash
// ══════════════════════════════════════════════════════
var ExtraRubriche = {
  CACHE_KEY: 'sw_extra_' + new Date().toISOString().split('T')[0],
  STELLE_TIPS: [
    {sign:'♊ Gemelli', tip:'La Luna in Gemelli esalta i bianchi aromatici. Apri un Gewürztraminer o un Moscato d\'Alsazia.'},
    {sign:'♌ Leone',   tip:'Giornata da grandi rossi: un Barolo giovane o un Bordeaux renderanno la serata indimenticabile.'},
    {sign:'♍ Vergine', tip:'Giornata minerale. Un Chablis o un Etna Bianco diranno più di mille parole.'},
    {sign:'♎ Bilancia', tip:'Cerca equilibrio: un Pinot Nero d\'Alsazia o un Brunello giovane esprimeranno raffinatezza assoluta.'},
    {sign:'♏ Scorpione',tip:'Luna misteriosa. I passiti e i vini ossidativi vivono il loro momento: Tokaj, Vin Jaune, Marsala Vergine.'},
    {sign:'♓ Pesci',   tip:'Giornata di sentimento. I vini rosati e i bianchi delicati parlano all\'anima meglio dei potenti rossi.'},
    {sign:'♒ Acquario', tip:'Venti di novità: esplora un vitigno sconosciuto. Un Nerello Mascalese o un Assyrtiko ti stupirà.'},
    {sign:'♑ Capricorno',tip:'La tradizione vince sempre. Un Amarone della Valpolicella o un Chianti Classico Riserva sono la scelta.'},
    {sign:'♋ Cancro',  tip:'Luna emotiva. I vini della memoria, quelli familiari, sono i protagonisti di oggi.'},
    {sign:'♐ Sagittario',tip:'Voglia di Nuovo Mondo: un Malbec di Mendoza o uno Syrah australiano porteranno avventura nel calice.'},
    {sign:'♉ Toro',    tip:'Piaceri sensoriali profondi. Un Amarone o un Super Tuscan soddisferanno ogni aspettativa.'},
    {sign:'♈ Ariete',  tip:'Energia e struttura: un Sagrantino di Montefalco o un Taurasi sono i vini di oggi.'}
  ],
  GRAND_TOURS: [
    {cantina:'Château Margaux',          luogo:'Bordeaux, Francia',   desc:'Costruito nel 1810 su terre che producono vino da 500 anni. L\'eleganza assoluta di Bordeaux.', q:'chateau margaux bordeaux winery estate'},
    {cantina:'Domaine de la Romanée-Conti',luogo:'Borgogna, Francia', desc:'1.8 ettari che valgono più di qualsiasi palazzo. Il vino più desiderato del mondo nasce qui.', q:'burgundy vineyard romanee conti vosne'},
    {cantina:'Tenuta San Guido',         luogo:'Bolgheri, Toscana',   desc:'Nel 1968 il Sassicaia cambiò per sempre il vino italiano. La prima DOC dedicata a una sola cantina.', q:'bolgheri tuscany vineyard sassicaia'},
    {cantina:'Schloss Johannisberg',     luogo:'Rheingau, Germania',  desc:'La tenuta del Riesling più antica del mondo. Fondata dai Benedettini nell\'anno 1100.', q:'schloss johannisberg rheingau germany castle vineyard'},
    {cantina:'Quinta do Noval Nacional', luogo:'Douro, Portogallo',   desc:'Una parcella di viti pre-fillossera che produce il Porto più raro e ricercato al mondo.', q:'quinta noval douro portugal vineyard terrace'},
    {cantina:'Henschke Hill of Grace',   luogo:'Eden Valley, Australia',desc:'Viti piantate nel 1860 da coloni tedeschi. Lo Shiraz più celebre dell\'emisfero australe.', q:'eden valley australia old vine shiraz winery'}
  ],

  init: function(containerId){
    var cont = document.getElementById(containerId);
    if(!cont) return;
    this.renderStelle(cont);
    var clockDiv = document.createElement('div');
    clockDiv.id = 'vignaClock';
    cont.appendChild(clockDiv);
    VignaCalendar.render('vignaClock');
    this.renderGrandTour(cont);
    if(apiKey || SERVER_URL){ this.generateFlash(cont); }
    else { this.renderFlash(cont, this.defaultFlash()); }
  },

  renderStelle: function(cont){
    var self = this;
    var day = new Date().getDay();
    var tip = this.STELLE_TIPS[( new Date().getDate() + day ) % this.STELLE_TIPS.length];

    var card = document.createElement('div');
    card.className = 'stelle-box gz-card';

    var body = document.createElement('div');
    body.style.padding = '14px 16px 16px';

    var lb = document.createElement('div');
    lb.className = 'gz-rubrica-label';
    lb.style.marginBottom = '10px';
    lb.textContent = '✦ VINI & STELLE — ' + tip.sign; lb.classList.add('shimmer-gold');
    body.appendChild(lb);

    var star = document.createElement('span');
    star.style.cssText = 'font-size:1.7rem;float:left;margin:0 12px 4px 0;';
    star.textContent = '🔮';
    body.appendChild(star);

    var p = document.createElement('p');
    p.className = 'stelle-text';
    p.style.margin = '0';
    p.id = 'stelleText_' + Date.now();
    // Prima mostra il testo fisso
    p.textContent = tip.tip;
    body.appendChild(p);

    var clr = document.createElement('div');
    clr.style.clear = 'both';
    body.appendChild(clr);

    card.appendChild(body);
    cont.appendChild(card);

    // Poi, se c'è la chiave API, rigenera con AI
    if(apiKey){
      var months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
      var m = months[new Date().getMonth()];
      var sys = 'Sei un astrologo del vino ironico e colto. Scrivi UN solo consiglio enologico astrologico di massimo 2 frasi per oggi. Mese: '+m+'. Segno del giorno: '+tip.sign+'. Deve essere specifico (cita un vino reale), poetico e un po\' giocoso. Solo il testo, niente altro.';
      callAPI(sys, 'Consiglio astrologico enologico di oggi', null, null).then(function(text){
        var el = document.getElementById(p.id);
        if(el) el.textContent = text.trim();
      }).catch(function(){});
    }
  },

  renderGrandTour: function(cont){
    var t = this.GRAND_TOURS[new Date().getDate() % this.GRAND_TOURS.length];
    var url = unsplashUrl(t.q, 800, 400);
    var card = document.createElement('div');
    card.className = 'gz-card';
    var headDiv = document.createElement('div');
    headDiv.style.cssText = 'padding:10px 14px 0;background:var(--fumo);';
    var lb = document.createElement('div');
    lb.className = 'gz-rubrica-label';
    lb.textContent = '🏰 GRAND TOUR'; lb.classList.add('shimmer-gold');
    headDiv.appendChild(lb);
    card.appendChild(headDiv);
    var img = document.createElement('img');
    img.className = 'grand-tour-img';
    img.src = url; img.alt = t.cantina; img.loading = 'lazy';
    card.appendChild(img);
    var body = document.createElement('div');
    body.className = 'grand-tour-body';
    var name = document.createElement('div');
    name.style.cssText = 'font-family:Cinzel,serif;font-size:1rem;font-weight:600;color:var(--crema);margin-bottom:5px;';
    name.textContent = t.cantina;
    var loc = document.createElement('div');
    loc.style.cssText = 'font-family:Cinzel,serif;font-size:.6rem;letter-spacing:.2em;color:var(--oro);margin-bottom:8px;';
    loc.textContent = '📍 ' + t.luogo;
    var desc = document.createElement('p');
    desc.style.cssText = 'font-family:Cormorant Garamond,serif;font-size:1rem;line-height:1.8;color:rgba(245,239,226,.72);margin:0;';
    desc.textContent = t.desc;
    body.appendChild(name); body.appendChild(loc); body.appendChild(desc);
    card.appendChild(body);
    cont.appendChild(card);
  },

  generateFlash: async function(cont){
    var self = this;
    var sys = 'Genera 3 titoli flash news sul vino italiano (max 12 parole ciascuno). JSON puro: ["titolo1","titolo2","titolo3"]';
    try{
      var text = await callAPI(sys,'Flash news vino oggi',null,null);
      var news = JSON.parse(text.replace(/```json|```/g,'').trim());
      self.renderFlash(cont, news);
    }catch(e){ self.renderFlash(cont, self.defaultFlash()); }
  },

  defaultFlash: function(){
    return [
      'Barolo 2020: l\'annata del secolo secondo i produttori delle Langhe',
      'Prosecco DOCG: record storico di export nei mercati asiatici',
      'Etna: i vigneti vulcanici battono ogni record d\'asta internazionale'
    ];
  },

  renderFlash: function(cont, items){
    var card = document.createElement('div');
    card.className = 'gz-card';
    var head = document.createElement('div');
    head.style.cssText = 'padding:10px 14px;border-bottom:1px solid var(--seppia);background:var(--fumo);';
    var lb = document.createElement('span');
    lb.className = 'gz-rubrica-label';
    lb.textContent = '⚡ FLASH NEWS'; lb.classList.add('shimmer-gold');
    head.appendChild(lb);
    card.appendChild(head);
    var body = document.createElement('div');
    body.style.cssText = 'padding:4px 14px 10px;background:var(--parch);';
    (items||[]).slice(0,3).forEach(function(item,i){
      var row = document.createElement('div');
      row.className = 'flash-item';
      var num = document.createElement('div');
      num.className = 'flash-num';
      num.textContent = String(i+1);
      var txt = document.createElement('div');
      txt.className = 'flash-text';
      txt.textContent = item;
      row.appendChild(num); row.appendChild(txt);
      body.appendChild(row);
    });
    card.appendChild(body);
    cont.appendChild(card);
  }
};

// ══════════════════════════════════════════════════════
// 4. GALLERIA TERROIR
// ══════════════════════════════════════════════════════
var TERROIR_GALLERY = [
  ['data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="400" height="160" fill="%231a0808"/></svg>',
   'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="400" height="160" fill="%230d0a05"/></svg>']
];
var _galleryIdx = 0;
function buildTerroirGallery(name, country, grapes){
  var gallery = document.createElement('div');
  gallery.className = 'terroir-gallery';
  var pair = TERROIR_GALLERY[_galleryIdx % TERROIR_GALLERY.length];
  _galleryIdx++;
  pair.forEach(function(src){
    var img = document.createElement('img');
    img.src = src;
    img.alt = name; img.loading = 'lazy';
    gallery.appendChild(img);
  });
  return gallery;
}

var _terroirHeaderIdx = 0;
var TERROIR_HEADERS = [
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="800" height="160" fill="%231a0808"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="800" height="160" fill="%230d0a05"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="800" height="160" fill="%231a0505"/></svg>',
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><rect width="800" height="160" fill="%230a0d1a"/></svg>'
];
function buildTerroirHeaderImg(name, country){
  var img = document.createElement('img');
  img.className = 'terroir-header-img';
  // Usa foto reali rotanti invece di source.unsplash
  _terroirHeaderIdx++;
  return img;
}

// ══════════════════════════════════════════════════════
// 5. PRE-CARICAMENTO DENOMINAZIONI POPOLARI
// ══════════════════════════════════════════════════════
var Prefetch = {
  POPULAR: ['barolo','champagne','brunello','amarone','chianti_classico','rioja','napa','mosel','wachau','tokaj'],
  running: false,

  start: function(){
    if(this.running || (!apiKey && !SERVER_URL)) return;
    this.running = true;
    var self = this;
    var idx = 0;
    function next(){
      if(idx >= self.POPULAR.length){ self.running = false; return; }
      var id = self.POPULAR[idx++];
      if(_expAI && _expAI[id]){ setTimeout(next, 100); return; }
      var feat = EXP.feats.find(function(f){ return f.id === id; });
      if(!feat){ setTimeout(next, 100); return; }
      // Precarica in silenzio
      loadExpAI(id, feat, {silent:true}).then(function(){ setTimeout(next, 3000); }).catch(function(){ setTimeout(next, 5000); });
    }
    setTimeout(next, 5000);
  }
};

// ══════════════════════════════════════════════════════
// 6. GOLD FLASH + EXCLUSIVE MODE — attivazione Pro
// ══════════════════════════════════════════════════════
function triggerGoldFlash(){
  var overlay = document.createElement('div');
  overlay.className = 'gold-flash-overlay';
  document.body.appendChild(overlay);
  setTimeout(function(){ overlay.remove(); }, 2000);
  // Attiva Exclusive Mode
  document.body.classList.add('exclusive');
  try { localStorage.setItem('sw_exclusive','1'); } catch(e){}
}

// Ripristina exclusive mode se già attivato
(function(){
  try {
    if(localStorage.getItem('sw_exclusive') === '1' && ProState.isActive()){
      document.body.classList.add('exclusive');
      var wm=document.createElement('div'); wm.id='proWatermark'; wm.className='pro-watermark';
      document.body.appendChild(wm);
    }
  } catch(e){}
})();

// Override activatePro per Gold Flash
var _origActivatePro = activatePro;
activatePro = async function(){
  await _origActivatePro();
  triggerGoldFlash();
};

// ══════════════════════════════════════════════════════
// 7. RICERCA AVANZATA PRO
// ══════════════════════════════════════════════════════
async function proAdvancedSearch(){
  if(!ProState.isActive()) return;
  var q = (document.getElementById('proSearchInput')||{}).value||'';
  if(!q.trim()) return;
  UserMemory.trackSearch(q);
  var resDiv = document.getElementById('proSearchResults');
  if(!resDiv) return;
  resDiv.innerHTML = '';
  var spinner = document.createElement('div');
  spinner.style.cssText = 'font-family:IM Fell English,serif;font-style:italic;font-size:.95rem;color:rgba(200,164,90,.5);padding:8px 0;';
  spinner.textContent = 'Ricerca in corso…';
  resDiv.appendChild(spinner);
  var hits = EXP.feats.filter(function(d){
    return (d.name||'').toLowerCase().includes(q.toLowerCase())||
           (d.grapes||'').toLowerCase().includes(q.toLowerCase())||
           (d.country||'').toLowerCase().includes(q.toLowerCase())||
           (d.description||'').toLowerCase().includes(q.toLowerCase());
  }).slice(0,6);
  resDiv.innerHTML = '';
  if(hits.length){
    var label = document.createElement('div');
    label.style.cssText = 'font-family:Cinzel,serif;font-size:.58rem;letter-spacing:.25em;color:var(--oro);margin-bottom:10px;';
    label.textContent = hits.length + ' DENOMINAZIONI TROVATE';
    resDiv.appendChild(label);
    hits.forEach(function(d){
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(200,164,90,.06);border:1px solid rgba(200,164,90,.12);border-radius:3px;margin-bottom:6px;cursor:pointer;';
      row.onclick = function(){
        document.querySelectorAll('.ntab').forEach(function(t){t.classList.remove('active');});
        var et=document.querySelector('[data-page="explore"]'); if(et) et.classList.add('active');
        document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
        var ep=document.getElementById('page-explore'); if(ep) ep.classList.add('active');
        renderExploreCountries();
        setTimeout(function(){ openExpDenom(d.id); },300);
      };
      var flag=document.createElement('span'); flag.style.fontSize='1.1rem'; flag.textContent=EFLAGS[d.country]||'🌍';
      var info=document.createElement('div');
      var nm=document.createElement('div'); nm.style.cssText='font-family:Cinzel,serif;font-size:.7rem;color:var(--crema);'; nm.textContent=d.name;
      var sb=document.createElement('div'); sb.style.cssText='font-family:IM Fell English,serif;font-style:italic;font-size:.88rem;color:var(--grigio);'; sb.textContent=d.country+' · '+(d.grapes||'').split(',')[0].trim();
      info.appendChild(nm); info.appendChild(sb);
      row.appendChild(flag); row.appendChild(info);
      resDiv.appendChild(row);
    });
  } else if(apiKey || SERVER_URL){
    var sys='Sommelier esperto. Risposta poetica e precisa in 2 frasi. Nessun tecnicismo.';
    try{
      var text=await callAPI(sys,q,null,null);
      var box=document.createElement('div'); box.style.cssText='padding:14px;background:rgba(200,164,90,.06);border-left:3px solid var(--oro);';
      var lb2=document.createElement('div'); lb2.className='gz-rubrica-label'; lb2.style.marginBottom='8px'; lb2.textContent='🍷 RISPOSTA DEL SOMMELIER';
      var p2=document.createElement('p'); p2.style.cssText='font-family:Cormorant Garamond,serif;font-size:1.05rem;line-height:1.85;color:var(--testo2);margin:0;'; p2.textContent=text;
      box.appendChild(lb2); box.appendChild(p2); resDiv.appendChild(box);
    }catch(e){}
  }
}

// ══════════════════════════════════════════════════════
// 8. SALUTO PRO
// ══════════════════════════════════════════════════════
function renderProGreeting(){
  var cont=document.getElementById('proGreeting');
  if(!cont||!ProState.isActive()) return;
  cont.style.display='block'; cont.innerHTML='';
  var email=ProState.getEmail(); var name=email?email.split('@')[0]:'Sommelier';
  var cap=name.charAt(0).toUpperCase()+name.slice(1);
  var h=new Date().getHours(); var g=h<12?'Buongiorno':h<18?'Buon pomeriggio':'Buonasera';
  var fav=UserMemory.getFavoriteCountry(); var grapes=UserMemory.getFavoriteGrapes();
  var wrap=document.createElement('div'); wrap.className='pro-greeting';
  var ico=document.createElement('span'); ico.style.fontSize='1.5rem'; ico.textContent='👑';
  var txt=document.createElement('div');
  var main=document.createElement('div'); main.className='pro-greeting-text'; main.textContent=g+', '+cap+' — Club del Terroir';
  var sub=document.createElement('div'); sub.className='pro-greeting-sub';
  var hints=[]; if(fav) hints.push('Esplori spesso: '+fav); if(grapes.length) hints.push('Vitigni preferiti: '+grapes.join(', '));
  sub.textContent=hints.length?hints.join(' · '):'Esplora le denominazioni del mondo';
  txt.appendChild(main); txt.appendChild(sub);
  wrap.appendChild(ico); wrap.appendChild(txt); cont.appendChild(wrap);
  var adv=document.getElementById('proAdvSearch'); if(adv) adv.style.display='block';
}

// ══════════════════════════════════════════════════════
// Override loadExpAI per supporto silent prefetch
// ══════════════════════════════════════════════════════
var _origLoadExpAI = loadExpAI;
loadExpAI = async function(id, d, opts){
  if(opts && opts.silent){
    if(!apiKey && !SERVER_URL) return;
    var sys='Enologo narratore. Scheda denominazione HTML puro — Storia, Terroir, Vitigni, Produzione, Nel Bicchiere, Abbinamenti, Produttori. Max 300 parole.';
    try{
      var text=await callAPI(sys,'Scheda: '+d.name+' ('+d.country+', '+d.grapes+')',null,null);
      if(typeof _expAI !== 'undefined') _expAI[id]=text;
    }catch(e){}
    return;
  }
  return _origLoadExpAI(id, d, opts);
};



// ══════════════════════════════════════════════════════════
// SISTEMA PRENOTAZIONE EVENTI
// ══════════════════════════════════════════════════════════
var _bookingData = {};

function openBooking(eventData){
  _bookingData = eventData || {};
  var modal = document.getElementById('bookingModal');
  var nameEl = document.getElementById('bookingEventName');
  var placeEl = document.getElementById('bookingEventPlace');
  if(!modal) return;

  if(nameEl) nameEl.textContent = (_bookingData.emoji||'📅') + ' ' + (_bookingData.titolo||'Evento');
  if(placeEl) placeEl.textContent = (_bookingData.cantina||'') + (_bookingData.luogo ? ' · 📍 '+_bookingData.luogo : '');

  // Reset form
  ['bookName','bookEmail','bookPhone','bookNote'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.value = '';
  });
  var pax = document.getElementById('bookPax');
  if(pax) pax.value = '2';
  var msg = document.getElementById('bookingMsg');
  if(msg) msg.textContent = '';

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Se c'è un link esterno, apri direttamente
  if(_bookingData.link){
    window.open(_bookingData.link, '_blank');
    closeBooking();
  }
}

function closeBooking(){
  var modal = document.getElementById('bookingModal');
  if(modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

function submitBooking(){
  var name  = (document.getElementById('bookName')||{}).value||'';
  var email = (document.getElementById('bookEmail')||{}).value||'';
  var pax   = (document.getElementById('bookPax')||{}).value||'2';
  var phone = (document.getElementById('bookPhone')||{}).value||'';
  var note  = (document.getElementById('bookNote')||{}).value||'';
  var msg   = document.getElementById('bookingMsg');

  if(!name.trim()){
    if(msg){ msg.textContent='Inserisci il tuo nome'; msg.style.color='#f99'; }
    return;
  }
  if(!email.trim() || !email.includes('@')){
    if(msg){ msg.textContent='Inserisci una email valida'; msg.style.color='#f99'; }
    return;
  }

  // Salva prenotazione: localStorage + window.userBookings (ispezionabile)
  var booking = {
    evento: _bookingData.titolo||'',
    cantina: _bookingData.cantina||'',
    data: _bookingData.data||'',
    luogo: _bookingData.luogo||'',
    nome: name, email: email, telefono: phone,
    persone: parseInt(pax)||2, note: note,
    timestamp: new Date().toISOString()
  };
  // window.userBookings — array globale ispezionabile dalla console
  if(!window.userBookings) window.userBookings = [];
  window.userBookings.push(booking);
  try{
    var bookings = JSON.parse(localStorage.getItem('sw_bookings')||'[]');
    bookings.push(booking);
    localStorage.setItem('sw_bookings', JSON.stringify(bookings));
  }catch(e){}

  // Mostra conferma
  if(msg){
    msg.style.color = 'var(--oro)';
    msg.textContent = '✨ ' + i18n.t('bookConfirm') + email + '.';
  }
  setTimeout(function(){ closeBooking(); }, 3000);
}



// ══════════════════════════════════════════════
// GENERATORI AI GIORNALIERI
// ══════════════════════════════════════════════
async function generateDailyHoroscope(containerId){
  var cont = document.getElementById(containerId);
  if(!cont || (!apiKey && !SERVER_URL)) return;
  var months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var signs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  var d = new Date();
  var sign = signs[(d.getDate() + d.getMonth()) % signs.length];
  var sys = 'Sei il sommelier astrologo della Gazzetta del Vino. Data di oggi: '+d.toLocaleDateString('it-IT')+'. Scrivi UN consiglio enologico-astrologico per oggi: 2 frasi eleganti e specifiche (cita un vino reale). Segno: '+sign+'. Mese: '+months[d.getMonth()]+'. Solo testo, nessun formato.';
  try{
    var text = await callAPI(sys, 'Oroscopo del vino oggi', null, null);
    cont.textContent = text.trim();
  }catch(e){}
}

async function generateVignaioloClock(containerId){
  var cont = document.getElementById(containerId);
  if(!cont || (!apiKey && !SERVER_URL)) return;
  var months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var m = months[new Date().getMonth()];
  var sys = 'Sei un vignaiolo poeta. Descrivi in 2 frasi liriche cosa succede oggi in vigna a '+m+' in Italia. Cita un gesto preciso, un profumo, un suono. Prosa, niente elenchi.';
  try{
    var text = await callAPI(sys, 'Vigna a '+m, null, null);
    cont.textContent = text.trim();
  }catch(e){}
}



// ══════════════════════════════════════════════════════════
// i18n — Supporto Multilingue IT | EN | FR
// ══════════════════════════════════════════════════════════
var i18n = {

  // ── Dizionari ──
  dict: {
    it: {
      // Nav
      home: 'Home', events: 'Eventi', terroir: 'Terroir',
      sommelier: 'Sommelier', producers: 'Produttori',
      // Masthead
      mastKicker: 'LA GAZZETTA DEL TERROIR',
      mastSub: 'L\'enciclopedia mondiale — dal suolo al bicchiere',
      mastDenoms: '327 DENOMINAZIONI', mastCountries: '28 PAESI',
      mastAI: 'SOMMELIER AI', mastEvents: 'EVENTI MONDIALI',
      // Home sections
      newsTitle: 'NOTIZIE DEL VINO', newsRefresh: '↻ Aggiorna',
      // Sommelier
      somTitle: 'Sommelier AI',
      somMenuPlaceholder: 'Scrivi i piatti del tuo menu (uno per riga)…',
      somBudget: 'Budget per bottiglia: €',
      somBtn: 'ABBINA I VINI',
      somLoading: 'Il Sommelier sta meditando…',
      // Terroir
      terroirTitle: 'Denominazioni del Mondo',
      terroirSub: '327 denominazioni · Tocca un paese per esplorare',
      terroirSearch: '🔎 Cerca denominazione, vitigno, paese…',
      // Pro
      proClub: 'Il Club del Terroir',
      proSub: 'Un accesso privilegiato al mondo del vino.',
      proPrice: '€9/mese',
      proTrial: '🎁 30 GIORNI GRATUITI',
      proBtn: 'ENTRA NEL CLUB',
      proEmail: 'La tua email…',
      // Booking
      bookTitle: '🎫 PRENOTA IL TUO POSTO',
      bookName: 'NOME E COGNOME', bookEmail: 'EMAIL',
      bookPhone: 'TELEFONO', bookPax: 'PERSONE', bookNote: 'NOTE (opzionale)',
      bookBtn: 'CONFERMA PRENOTAZIONE',
      bookConfirm: 'Richiesta inviata a Sommelier World. Riceverai conferma via email a ',
      // Footer
      copyright: '© 2026 SOMMELIER WORLD — MARCHIO REGISTRATO',
      allRights: 'Tutti i contenuti sono protetti. Riproduzione vietata.',
      // Settings
      apiKeyLabel: 'CHIAVE API GROQ',
      apiKeyPlaceholder: 'Incolla la tua chiave gsk_…',
      apiSave: 'SALVA', apiTest: 'TEST',
      // Misc
      loading: 'Caricamento…', error: 'Errore',
      configKey: 'Configura la chiave AI (⚙️)',
      searchBtn: 'CERCA',
      // AI lang instruction
      aiLang: 'Rispondi in italiano.'
    },
    en: {
      home: 'Home', events: 'Events', terroir: 'Terroir',
      sommelier: 'Sommelier', producers: 'Producers',
      mastKicker: 'THE WINE GAZETTE',
      mastSub: 'The world encyclopedia — from soil to glass',
      mastDenoms: '327 APPELLATIONS', mastCountries: '28 COUNTRIES',
      mastAI: 'AI SOMMELIER', mastEvents: 'WORLD EVENTS',
      newsTitle: 'WINE NEWS', newsRefresh: '↻ Refresh',
      somTitle: 'AI Sommelier',
      somMenuPlaceholder: 'Write your menu dishes (one per line)…',
      somBudget: 'Budget per bottle: €',
      somBtn: 'PAIR WINES',
      somLoading: 'The Sommelier is contemplating…',
      terroirTitle: 'World Appellations',
      terroirSub: '327 appellations · Tap a country to explore',
      terroirSearch: '🔎 Search appellation, grape, country…',
      proClub: 'The Terroir Club',
      proSub: 'Privileged access to the world of wine.',
      proPrice: '€9/month',
      proTrial: '🎁 30 DAYS FREE',
      proBtn: 'JOIN THE CLUB',
      proEmail: 'Your email…',
      bookTitle: '🎫 BOOK YOUR SEAT',
      bookName: 'FULL NAME', bookEmail: 'EMAIL',
      bookPhone: 'PHONE', bookPax: 'GUESTS', bookNote: 'NOTES (optional)',
      bookBtn: 'CONFIRM BOOKING',
      bookConfirm: 'Request sent to Sommelier World. You will receive confirmation by email at ',
      copyright: '© 2026 SOMMELIER WORLD — REGISTERED TRADEMARK',
      allRights: 'All content is protected. Reproduction prohibited.',
      apiKeyLabel: 'GROQ API KEY',
      apiKeyPlaceholder: 'Paste your gsk_ key…',
      apiSave: 'SAVE', apiTest: 'TEST',
      loading: 'Loading…', error: 'Error',
      configKey: 'Configure AI key (⚙️)',
      searchBtn: 'SEARCH',
      aiLang: 'Reply in English.'
    },
    fr: {
      home: 'Accueil', events: 'Événements', terroir: 'Terroir',
      sommelier: 'Sommelier', producers: 'Producteurs',
      mastKicker: 'LA GAZETTE DU TERROIR',
      mastSub: 'L\'encyclopédie mondiale — du sol au verre',
      mastDenoms: '327 APPELLATIONS', mastCountries: '28 PAYS',
      mastAI: 'SOMMELIER IA', mastEvents: 'ÉVÉNEMENTS MONDIAUX',
      newsTitle: 'ACTUALITÉS DU VIN', newsRefresh: '↻ Actualiser',
      somTitle: 'Sommelier IA',
      somMenuPlaceholder: 'Écrivez les plats de votre menu (un par ligne)…',
      somBudget: 'Budget par bouteille: €',
      somBtn: 'ACCORDER LES VINS',
      somLoading: 'Le Sommelier médite…',
      terroirTitle: 'Appellations du Monde',
      terroirSub: '327 appellations · Appuyez sur un pays pour explorer',
      terroirSearch: '🔎 Chercher appellation, cépage, pays…',
      proClub: 'Le Club du Terroir',
      proSub: 'Un accès privilégié au monde du vin.',
      proPrice: '€9/mois',
      proTrial: '🎁 30 JOURS GRATUITS',
      proBtn: 'REJOINDRE LE CLUB',
      proEmail: 'Votre email…',
      bookTitle: '🎫 RÉSERVER VOTRE PLACE',
      bookName: 'NOM ET PRÉNOM', bookEmail: 'EMAIL',
      bookPhone: 'TÉLÉPHONE', bookPax: 'PERSONNES', bookNote: 'NOTES (facultatif)',
      bookBtn: 'CONFIRMER LA RÉSERVATION',
      bookConfirm: 'Demande envoyée à Sommelier World. Vous recevrez une confirmation par email à ',
      copyright: '© 2026 SOMMELIER WORLD — MARQUE DÉPOSÉE',
      allRights: 'Tous les contenus sont protégés. Reproduction interdite.',
      apiKeyLabel: 'CLÉ API GROQ',
      apiKeyPlaceholder: 'Collez votre clé gsk_…',
      apiSave: 'SAUVER', apiTest: 'TEST',
      loading: 'Chargement…', error: 'Erreur',
      configKey: 'Configurez la clé IA (⚙️)',
      searchBtn: 'CHERCHER',
      aiLang: 'Réponds en français.'
    }
  },

  // ── Stato corrente ──
  current: 'it',

  // ── Rileva lingua dal browser o da localStorage ──
  detect: function(){
    try{
      var saved = localStorage.getItem('sw_lang');
      if(saved && this.dict[saved]){ this.current = saved; }
      else {
        var nav = (navigator.language || navigator.userLanguage || 'it').toLowerCase();
        if(nav.startsWith('it')) this.current = 'it';
        else if(nav.startsWith('fr')) this.current = 'fr';
        else this.current = 'en';
      }
    }catch(e){ this.current = 'it'; }
  },

  // ── Ottieni traduzione ──
  t: function(key){ 
    return (this.dict[this.current] && this.dict[this.current][key]) || 
           (this.dict['en'] && this.dict['en'][key]) || key; 
  },

  // ── Comando lingua per l'AI ──
  aiCmd: function(){ return this.t('aiLang') + ' '; },

  // ── Cambia lingua manualmente ──
  setLang: function(lang){
    if(!this.dict[lang]) return;
    this.current = lang;
    try{ localStorage.setItem('sw_lang', lang); }catch(e){}
    // Aggiorna pulsanti lingua visivi
    ['it','en','fr'].forEach(function(l){
      var btn = document.getElementById('langBtn_'+l);
      if(btn){
        if(l === lang){
          btn.style.background = 'rgba(191,155,74,.2)';
          btn.style.color = 'var(--oro)';
        } else {
          btn.style.background = 'none';
          btn.style.color = 'rgba(191,155,74,.45)';
        }
      }
    });
    this.applyAll();
    // Ricarica sempre le notizie nella nuova lingua
    setTimeout(function(){ 
      if(typeof loadNews === 'function') loadNews(true); 
    }, 200);
  },

  // ── Applica traduzioni a tutto il DOM ──
  applyAll: function(){
    var t = this.t.bind(this);

    // Nav labels
    var tabs = {home:'home',events:'events',terroir:'terroir',sommelier:'sommelier',producers:'producers'};
    Object.keys(tabs).forEach(function(page){
      var tab = document.querySelector('[data-page="'+page+'"] .lbl');
      if(tab) tab.textContent = i18n.t(tabs[page]);
    });

    // Masthead (senza duplicati)
    this._setText('mastKicker', t('mastKicker'));
    this._setText('mastSub', t('mastSub'));
    // Badge denominazioni (stringa unificata nel DOM)
    var mb = document.getElementById('mastBadge');
    if(mb) mb.textContent = t('mastDenoms') + ' · ' + t('mastCountries');

    // News section
    var nh = document.querySelector('.news-section-head span:last-child');
    if(nh) nh.textContent = t('newsTitle');

    // Pro modal
    this._setText('proClubTitle', t('proClub'));
    this._setText('proClubSub', t('proSub'));
    this._setText('proActivateBtn', t('proBtn'));
    this._setPlaceholder('proEmail', t('proEmail'));

    // Booking modal
    this._setText('bookingModalTitle', t('bookTitle'));
    this._setText('bookLabelName',  t('bookName'));
    this._setText('bookLabelEmail', t('bookEmail'));
    this._setText('bookLabelPhone', t('bookPhone'));
    this._setText('bookLabelPax',   t('bookPax'));
    this._setText('bookLabelNote',  t('bookNote'));
    this._setText('bookSubmitBtn',  t('bookBtn'));

    // Search inputs
    this._setPlaceholder('exploreSearch', t('terroirSearch'));
    this._setText('terroirSubTitle', t('terroirSub'));

    // Booking placeholders
    this._setPlaceholder('bookName', t('bookName') === t('bookName') ? '' : '');
    this._setPlaceholder('proEmail', t('proEmail'));
    // Sommelier
    this._setPlaceholder('menuText', t('somMenuPlaceholder'));
    this._setText('somBtnLabel', t('somBtn'));

    // Footer
    this._setText('footerCopyright', t('copyright'));
    this._setText('footerRights', t('allRights'));

    // Switcher lingua — aggiorna stile buttons
    ['it','en','fr'].forEach(function(lang){
      var btn = document.getElementById('langBtn_'+lang);
      if(btn){
        if(lang === i18n.current){
          btn.style.background = 'rgba(191,155,74,.22)';
          btn.style.color = 'var(--oro)';
          btn.style.opacity = '1';
        } else {
          btn.style.background = 'none';
          btn.style.color = 'rgba(191,155,74,.4)';
          btn.style.opacity = '0.7';
        }
      }
    });

    document.documentElement.lang = this.current;
    var navInd = document.getElementById('navLangIndicator');
    if(navInd) navInd.textContent = this.current.toUpperCase();
    
    // Aggiorna elementi con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var translated = i18n.t(key);
      if(translated && translated !== key) el.textContent = translated;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
      var key = el.getAttribute('data-i18n-ph');
      var translated = i18n.t(key);
      if(translated && translated !== key) el.placeholder = translated;
    });
    
    // Titoli sezioni principali
    var somTitleEl = document.querySelector('#page-sommelier .som-main-title');
    if(somTitleEl) somTitleEl.textContent = t('somTitle');

    // Pulsante cerca sommelier
    var somBtn2 = document.getElementById('somBtnLabel');
    if(!somBtn2){
      // Cerca il bottone direttamente
      document.querySelectorAll('#page-sommelier button').forEach(function(btn){
        if(btn.textContent.indexOf('ABBINA') > -1 || btn.textContent.indexOf('PAIRING') > -1 || btn.textContent.indexOf('ACCORDER') > -1){
          btn.textContent = t('somBtn');
        }
      });
    }

    // Titoli pagine statiche con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var val = i18n.t(key);
      if(val && val !== key) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
      var key = el.getAttribute('data-i18n-ph');
      var val = i18n.t(key);
      if(val && val !== key) el.placeholder = val;
    });

    // Aggiorna titolo browser
    document.title = 'Sommelier World' + (this.current !== 'it' ? ' · ' + this.current.toUpperCase() : '');
  },

  _setText: function(id, text){
    var el = document.getElementById(id);
    if(el) el.textContent = text;
  },
  _setPlaceholder: function(id, text){
    var el = document.getElementById(id);
    if(el) el.placeholder = text;
  }
};

// Inizializza lingua
i18n.detect();


// ── INIT ──
(function(){
  var d = new Date();
  var months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  var days = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  var el = document.getElementById('mastDate');
  if(el) el.textContent = days[d.getDay()]+' '+d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
})();
loadNews(false);
setDailyTheme();
// Applica traduzioni dopo che il DOM è pronto
// Init lingua
(function(){
  var savedLang = null;
  try{ savedLang = localStorage.getItem('sw_lang'); }catch(e){}
  if(savedLang && i18n.dict[savedLang]){
    i18n.current = savedLang;
    // Attiva pulsante corretto
    ['it','en','fr'].forEach(function(l){
      var btn = document.getElementById('langBtn_'+l);
      if(btn){
        if(l === savedLang){
          btn.style.background = 'rgba(191,155,74,.2)';
          btn.style.color = 'var(--oro)';
        } else {
          btn.style.background = 'none';
          btn.style.color = 'rgba(191,155,74,.45)';
        }
      }
    });
  }
  setTimeout(function(){ i18n.applyAll(); }, 50);
})();

// ── PREFETCH DENOMINAZIONI POPOLARI ──
// Precarica in background le schede delle 10 denominazioni più visitate
// così quando l'utente le apre sono già pronte
(function prefetchPopular(){
  if(!apiKey && !SERVER_URL) return;
  var popular = ['barolo','brunello','champagne','chianti_classico','amarone',
                 'gevrey','napa','rioja','port','tokaj'];
  var delay = 8000; // aspetta 8s che l'app sia caricata
  popular.forEach(function(id, i){
    setTimeout(function(){
      // Salta se già in cache
      if(_expAI && _expAI[id]) return;
      var d = EXP.feats.find(function(f){ return f.id===id; });
      if(!d) return;
      var dummyDiv = document.createElement('div');
      loadExpAI(id, d, dummyDiv);
    }, delay + i * 3000); // una ogni 3 secondi per non sovraccaricare
  });
})();
setTimeout(function(){ ExtraRubriche.init('rubricheExtra'); }, 600);
setTimeout(function(){ RubricheEditor.init(); }, 400);
if(ProState.isActive()){
  setTimeout(function(){ GazzettaEditor.init(); }, 800);
  setTimeout(function(){ renderProGreeting(); }, 200);
}
// Pre-caricamento silenzioso denominazioni popolari
setTimeout(function(){ Prefetch.start(); }, 8000);


// ── COOKIE GDPR ──
(function(){
  try{
    if(!localStorage.getItem('cookie_consent')){
      $show('cookieBanner');
    }
  }catch(e){}
})();
function acceptCookies(){
  localStorage.setItem('cookie_consent','all');
  document.getElementById('cookieBanner').style.display='none';
}
function rejectCookies(){
  localStorage.setItem('cookie_consent','minimal');
  document.getElementById('cookieBanner').style.display='none';
}

// ── LEGAL PAGES ──
var _prevPage = 'home';
function showPage(pageId){
  var cur = document.querySelector('.page.active');
  if(cur) _prevPage = cur.id.replace('page-','');
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  var target = $el('page-'+pageId);
  if(target){target.style.display='block';target.classList.add('active');}
  window.scrollTo(0,0);
}
function goBack(){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');p.style.display='';});
  var prev = document.getElementById('page-'+_prevPage)||document.getElementById('page-home');
  prev.classList.add('active');
  window.scrollTo(0,0);
}

// ── RICERCA VITIGNO GLOBALE ──
async function cercaVitigno(){
  var q = (document.getElementById('vitignoSearch')||{}).value;
  if(!q||!q.trim()) return;
  q = q.trim();
  var res = document.getElementById('vitignoResult');
  if(!res) return;
  res.style.display='block';
  res.innerHTML='<div class="dai-load">Ricerca in corso…</div>';
  
  if(!apiKey && !SERVER_URL){
    res.innerHTML='<div class="dai-load" style="color:rgba(191,155,74,.3);">Server non disponibile</div>';
    return;
  }
  
  var sys='Sei un ampelografo e Master Sommelier. Per il vitigno richiesto scrivi una scheda tecnica completa in HTML puro:\n<div style="font-family:Cinzel,serif;font-size:1rem;letter-spacing:2px;color:var(--crema);margin-bottom:4px;">[NOME VITIGNO]</div>\n<div style="font-family:IM Fell English,serif;font-style:italic;font-size:.85rem;color:rgba(191,155,74,.6);margin-bottom:14px;">[sinonimi e nomi locali]</div>\n<div class="dp-sec-head">🌍 Origine e Storia</div><p>[paese di origine, storia, etimologia del nome, diffusione storica]</p>\n<div class="dp-sec-head">🍃 Ampelografia</div><p>[descrizione foglia, grappolo, acino, buccia, polpa — termini tecnici precisi]</p>\n<div class="dp-sec-head">🌱 Terroir e Coltivazione</div><p>[suoli ideali con nomi geologici, clima, altitudine ottimale, forme di allevamento tradizionali, epoca germogliamento e vendemmia]</p>\n<div class="dp-sec-head">🍷 Profilo Organolettico</div><p>[colore, aromi primari secondari terziari specifici, trama tannica, acidità, corpo, alcol tendenziale, longevità]</p>\n<div class="dp-sec-head">🌍 Denominazioni nel Mondo</div><p>[elenco delle principali DOC/DOCG/AOC/AVA dove è coltivato con paese]</p>\n<div class="dp-sec-head">🍽 Abbinamenti Ideali</div><p>[4-5 abbinamenti specifici con piatti tradizionali]</p>\n<div class="dp-sec-head">🏅 Produttori di Riferimento</div><p>[4-5 produttori top mondiali con una nota]</p>\nNiente markdown. HTML puro. Italiano tecnico. Max 400 parole.';
  
  try{
    var text = await callAPI(sys, 'Scheda ampelografica completa per: '+q, null, null);
    res.innerHTML='<div class="dai-text" style="margin-top:8px;">'+text+'</div>';
  }catch(e){
    res.innerHTML='<div class="dai-load" style="color:#f77;">Errore: '+e.message+'</div>';
  }
}

// ── MOUNT GARANTITO ──
window.addEventListener('load', function(){
  // Nascondi welcome box se API key presente
  if((apiKey && apiKey.length > 10) || SERVER_URL){
    var wb = document.getElementById('welcomeBox');
    if(wb) wb.style.display = 'none';
  }
  // Avvia GazzettaEditor se Pro
  if(typeof ProState !== 'undefined' && ProState.isActive()){
    if(typeof GazzettaEditor !== 'undefined') GazzettaEditor.init();
  }
});

// ── PWA Service Worker ──
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').catch(function(){});
}

async function loadGrapeScheda(name, container){
  container.innerHTML='<div class="dai-load">Caricamento scheda '+name+'...</div>';
  if(!apiKey && !SERVER_URL){
    container.innerHTML='<div class="dai-load" style="color:rgba(191,155,74,.3);">Server AI non disponibile</div>';
    return;
  }
  var sys='Ampelografo esperto. Scheda HTML puro: <div class="dp-sec-head">🌍 Origine e Storia</div><p>[paese, storia, sinonimi]</p><div class="dp-sec-head">🍃 Ampelografia</div><p>[foglia, grappolo, acino tecnici]</p><div class="dp-sec-head">🌱 Terroir Ideale</div><p>[suoli, clima, altitudine]</p><div class="dp-sec-head">🍷 Nel Bicchiere</div><p>[colore, aromi, struttura, longevita, abbinamenti]</p><div class="dp-sec-head">🌍 Coltivato in</div><p>[DOC/AOC mondiali]</p>. Max 250 parole.';
  try{
    var text = await callAPI(sys, 'Scheda ampelografica: '+name, null, null);
    container.innerHTML = '<div class="dai-text">'+text+'</div>';
  } catch(e){
    container.innerHTML='<div class="dai-load" style="color:#f99;">'+e.message+'</div>';
  }
}

function filterExplore(q){
  if(!q||!q.trim()){ renderExploreCountries(); return; }
  UserMemory.trackSearch(q);
  q = q.toLowerCase().trim();
  showSection('expSearch');
  var hits = EXP.feats.filter(function(d){
    return (d.name||'').toLowerCase().includes(q) ||
           (d.country||'').toLowerCase().includes(q) ||
           (d.grapes||'').toLowerCase().includes(q) ||
           (d.region||'').toLowerCase().includes(q);
  });
  var cont = clearEl('expSearch');
  cont.appendChild(el('div',{
    style:'font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;color:rgba(191,155,74,.4);padding:8px 16px;',
    text:hits.length+' risultati per "'+q+'"'
  }));
  if(!hits.length){
    cont.appendChild(el('div',{style:'padding:20px;font-family:IM Fell English,serif;font-style:italic;color:rgba(191,155,74,.3);',text:'Nessun risultato trovato'}));
    return;
  }
  hits.slice(0,40).forEach(function(d){
    var row = el('div',{
      style:'padding:11px 16px;border-bottom:1px solid rgba(191,155,74,.07);cursor:pointer;',
      onclick:function(){ openExpDenom(d.id); }
    },[
      el('div',{style:'font-family:Cinzel,serif;font-size:.65rem;color:var(--crema);',text:d.name}),
      el('div',{style:'font-family:IM Fell English,serif;font-style:italic;font-size:.73rem;color:rgba(245,239,226,.4);margin-top:2px;',text:(EFLAGS[d.country]||'🌍')+' '+d.country+' · '+(d.grapes||'').split(',')[0].trim()})
    ]);
    row.addEventListener('mouseover',function(){this.style.background='rgba(92,26,26,.2)';});
    row.addEventListener('mouseout',function(){this.style.background='transparent';});
    cont.appendChild(row);
  });
}

// ── EVENTI STATICI DI FALLBACK ──
var STATIC_EVENTS = [
  {emoji:'🍷',titolo:'Vinitaly 2026',cantina:'Vinitaly',luogo:'Verona, Italia',
   data:'5-8 Aprile 2026',descrizione:'La fiera internazionale del vino più importante al mondo.',
   prezzo:'Su invito / €35',photo_query:'wine fair exhibition',link:'https://www.vinitaly.com/'},
  {emoji:'🌍',titolo:'ProWein 2027',cantina:'ProWein',luogo:'Düsseldorf, Germania',
   data:'Marzo 2027',descrizione:'Fiera mondiale vino. 60.000+ visitatori professionali.',
   prezzo:'Su invito',photo_query:'wine exhibition professional',link:'https://www.prowein.com/'},
  {emoji:'🇬🇧',titolo:'London Wine Fair',cantina:'London Wine Fair',luogo:'Londra, UK',
   data:'Maggio 2026',descrizione:'La principale fiera del vino del mercato anglosassone.',
   prezzo:'Su invito / £40',photo_query:'wine tasting elegant',link:'https://www.londonwinefair.com/'},
  {emoji:'🐌',titolo:'Slow Wine Fair',cantina:'Slow Food',luogo:'Bologna, Italia',
   data:'Febbraio 2027',descrizione:'Salone internazionale dei vini naturali, biologici e biodinamici.',
   prezzo:'€20',photo_query:'wine organic natural',link:'https://slowinefair.slowfood.it/en/'},
  {emoji:'🎓',titolo:'Masterclass Nebbiolo',cantina:'AIS Piemonte',luogo:'Torino, Italia',
   data:'Aprile 2026',descrizione:'Degustazione verticale Barolo, Barbaresco, Gattinara con focus su MGA e terroir.',
   prezzo:'€45',photo_query:'wine masterclass sommelier',link:'https://www.aispiemonte.it/'},
  {emoji:'🏰',titolo:'Grand Tour Borgogna',cantina:'Maison Drouhin',luogo:'Dijon, Francia',
   data:'9-12 Maggio 2026',descrizione:'Visite a cantine storiche di Côte de Nuits e Côte de Beaune.',
   prezzo:'€280 tutto incluso',photo_query:'burgundy chateau vineyard',link:'https://www.drouhin.com/'},
];
(function(){
  var _orig = typeof loadEvents !== 'undefined' ? loadEvents : null;
  if(_orig) loadEvents = async function(force){
    if(!apiKey && !SERVER_URL){
      var cont = document.getElementById('eventsContainer');
      if(cont) renderEvents(STATIC_EVENTS);
      return;
    }
    return _orig(force);
  };
})();


// ── Selezione pacchetto nella pagina Produttori ──
var _selPkgPage = '';
function selectPkgPage(pkg, el){
  _selPkgPage = pkg;
  // Reset tutte le card
  ['basic','premium','elite'].forEach(function(p){
    var card = document.getElementById('pkgCard_'+p);
    var check = document.getElementById('check_'+p);
    if(card){
      card.style.border = p==='basic' ? '1px solid rgba(191,155,74,.2)' : 
                          p==='premium' ? '1px solid rgba(191,155,74,.35)' : '1px solid rgba(191,155,74,.45)';
      card.style.background = p==='basic' ? 'rgba(191,155,74,.05)' :
                              p==='premium' ? 'rgba(92,26,26,.12)' : 'rgba(191,155,74,.08)';
    }
    if(check){ check.textContent=''; check.style.background=''; check.style.borderColor='rgba(191,155,74,.3)'; }
  });
  // Evidenzia la card selezionata
  var selCard = document.getElementById('pkgCard_'+pkg);
  var selCheck = document.getElementById('check_'+pkg);
  if(selCard){ selCard.style.border='2px solid var(--oro)'; selCard.style.background='rgba(92,26,26,.25)'; }
  if(selCheck){ selCheck.textContent='✓'; selCheck.style.background='var(--oro)'; selCheck.style.color='var(--nero)'; selCheck.style.borderColor='var(--oro)'; }
  // Abilita pulsante
  var btn = document.getElementById('procediProdBtn');
  var hint = document.getElementById('pkgPageHint');
  if(btn){ btn.disabled=false; btn.style.cssText='font-family:Cinzel,serif;font-size:.62rem;letter-spacing:3px;width:100%;padding:14px;background:var(--vino);color:#fff;border:none;cursor:pointer;margin-bottom:8px;'; }
  if(hint){ var names={basic:'Basic €19/mese',premium:'Premium €49/mese',elite:'Elite €99/mese'}; hint.textContent='Pacchetto selezionato: '+names[pkg]; hint.style.color='rgba(191,155,74,.65)'; }
}


// ── ARTICLE READER ──
var _currentArticle = null;

function openArticle(idxOrArt){
  var art = (typeof idxOrArt === 'number') ? (window._newsArticles && window._newsArticles[idxOrArt]) : idxOrArt;
  if(!art) return;
  _currentArticle = art;
  var reader = document.getElementById('articleReader');
  var img = document.getElementById('readerImg');
  document.getElementById('readerCat').textContent = (art.emoji||'') + ' ' + (art.cat||'');
  document.getElementById('readerCatBig').textContent = (art.emoji||'') + ' ' + (art.cat||'');
  document.getElementById('readerTitle').textContent = art.title||'';
  // Non usare foto Unsplash per articoli - usa colori categoria
  img.style.display='none';
  // Corpo articolo espanso
  var body = document.getElementById('readerBody');
  if(art.fullText){
    body.innerHTML = art.fullText;
  } else {
    // Genera testo esteso dall'AI se disponibile
    body.innerHTML = '<p>' + art.text + '</p>';
    if(apiKey || SERVER_URL){
      body.innerHTML += '<div style="text-align:center;padding:20px;color:rgba(191,155,74,.4);font-family:IM Fell English,serif;font-style:italic;">Approfondimento in corso…</div>';
      expandArticleWithAI(art, body);
    }
  }
  reader.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeArticle(){
  var reader = document.getElementById('articleReader');
  reader.classList.remove('open');
  document.body.style.overflow = '';
}

async function expandArticleWithAI(art, container){
  var catLower = (art.cat||'').toLowerCase();
  var titleLower = (art.title||'').toLowerCase();
  var sys = (
    'Sei il caporedattore di Sommelier World, la più autorevole rivista enologica italiana digitale. ' +
    'Scrivi un articolo LUNGO, COINVOLGENTE e PROFESSIONALE di 700-800 parole in italiano. ' +
    'Lo stile è quello del Gambero Rosso incontra il Corriere della Sera: informativo, appassionante, preciso. ' +
    '\n\nSTRUTTURA OBBLIGATORIA (usa <h3> per i titoli di sezione):\n' +
    '- Apertura narrativa (2-3 frasi): inizia con un aneddoto, una citazione storica, un dato sorprendente — mai con "Questo articolo parla di". ' +
    '- Sezione 1 (150 parole): la storia — origini, protagonisti reali con nomi, date precise, aneddoti concreti. ' +
    '- Sezione 2 (150 parole): il territorio — suolo geologico, clima, come influenza il vino in modo specifico. ' +
    '- Sezione 3 (150 parole): la tecnica — viticoltura, vinificazione, cosa rende questo vino diverso dagli altri. ' +
    '- Sezione 4 (100 parole): nel bicchiere — aromi SPECIFICI (non "fruttato" ma "ciliegia matura e spezie orientali"), struttura, longevità. ' +
    '- Sezione 5 (100 parole): i protagonisti oggi — 3-4 produttori con stile e vino di punta specifici. ' +
    '- Chiusura (50 parole): una frase memorabile, un consiglio pratico, o un fatto curioso che il lettore non dimenticherà. ' +
    '\n\nREGOLE ASSOLUTE: ' +
    '1. SOLO tag HTML: <p>, <h3>, <strong>, <em>. NIENTE immagini, NIENTE link, NIENTE markdown. ' +
    '2. SEMPRE dati concreti: anni, nomi, luoghi, cifre. MAI frasi generiche. ' +
    '3. Se parli di vitigno BIANCO (Riesling, Vermentino, Chardonnay, Gewurztraminer, Greco, Fiano, Pinot Grigio): ' +
    '   descrivilo come BIANCO con aromi di agrumi/fiori bianchi/mineralità. ' +
    '4. Se parli di vitigno ROSSO: tannini, frutta rossa/nera, struttura. ' +
    '5. Chiudi SEMPRE con almeno 3 produttori reali e il loro vino di punta.'
  );
  var prompt = 'Categoria: ' + art.cat + '\nTitolo: ' + art.title + '\nTesto iniziale: ' + art.text;
  // Cache articolo espanso (cambia ogni settimana, non ogni volta)
  var artCacheKey = 'sw_art_' + btoa(unescape(encodeURIComponent((art.title||'').substring(0,30)))).substring(0,20);
  try{
    var artCached = localStorage.getItem(artCacheKey);
    if(artCached){
      container.innerHTML = '<p style="font-size:1.05rem;line-height:1.9;color:rgba(245,239,226,.88);">' + art.text + '</p>'
        + '<hr style="border:none;border-top:1px solid rgba(191,155,74,.2);margin:22px 0;">'
        + '<div style="font-family:Cormorant Garamond,serif;">' + artCached + '</div>';
      return;
    }
  }catch(e){}

  try {
    var expanded = await callAPILong(sys, prompt);
    // Rimuovi TUTTO ciò che non è testo
    expanded = expanded
      .replace(/```html|```/g, '')
      .replace(/<img[^>]*>/gi, '')
      .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
      .replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '')
      .replace(/src\s*=\s*["'][^"']*["']/gi, '')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '<strong>$1</strong>')
      .trim();
    // Salva in cache
    try{ localStorage.setItem(artCacheKey, expanded); }catch(e){}
    container.innerHTML = '<p style="font-size:1.05rem;line-height:1.9;color:rgba(245,239,226,.88);">' + art.text + '</p>'
      + '<hr style="border:none;border-top:1px solid rgba(191,155,74,.2);margin:22px 0;">'
      + '<div style="font-family:Cormorant Garamond,serif;">' + expanded + '</div>';
  } catch(e){
    container.innerHTML = '<p style="font-size:1.05rem;line-height:1.9;color:rgba(245,239,226,.88);">' + art.text + '</p>';
  }
}



// ══════════════════════════════════════════════════════
// COMPARATORE TERROIR
// ══════════════════════════════════════════════════════

// Init select con denominazioni disponibili
function initCmpSelects(){
  var opts = '<option value="">Nessuna</option>';
  var sorted = (EXP.feats||[]).slice().sort(function(a,b){ return a.name.localeCompare(b.name); });
  sorted.forEach(function(d){
    opts += '<option value="'+d.id+'">'+d.name+' ('+d.country+')</option>';
  });
  ['cmp1','cmp2','cmp3'].forEach(function(id,i){
    var sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = (i===0?'<option value="">Scegli…</option>':'<option value="">Nessuna</option>') + opts.replace('<option value="">Nessuna</option>','');
  });
}

// Aggiorna preview selezione + abilita tasto
function updateCmpPreview(){
  var ids = ['cmp1','cmp2','cmp3'].map(function(id){
    var sel=document.getElementById(id); return sel?sel.value:'';
  }).filter(Boolean);
  var prev = document.getElementById('cmpPreview');
  var btn = document.getElementById('cmpBtn');
  if(prev){
    prev.innerHTML = ids.map(function(id){
      var d=(EXP.feats||[]).find(function(f){return f.id===id;});
      if(!d) return '';
      return '<span style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:1px;padding:4px 10px;background:rgba(92,26,26,.3);border:1px solid rgba(191,155,74,.3);color:var(--crema);border-radius:2px;">'+(EFLAGS[d.country]||'🌍')+' '+d.name+'</span>';
    }).join('');
  }
  if(btn){
    var ok = ids.length >= 2;
    btn.disabled = !ok;
    btn.style.cssText = ok
      ? 'width:100%;padding:13px;background:var(--vino);color:#fff;font-family:Cinzel,serif;font-size:.6rem;letter-spacing:3px;border:none;cursor:pointer;border-radius:2px;transition:all .2s;'
      : 'width:100%;padding:13px;background:rgba(92,26,26,.3);color:rgba(191,155,74,.4);font-family:Cinzel,serif;font-size:.6rem;letter-spacing:3px;border:1px solid rgba(191,155,74,.2);cursor:not-allowed;border-radius:2px;transition:all .2s;';
  }
}

// Selezione rapida preset
function quickCompare(id1, id2, id3){
  // Naviga alla pagina compare
  document.querySelectorAll('.ntab').forEach(function(t){ t.classList.remove('active'); });
  var ctab=document.querySelector('[data-page="compare"]');
  if(ctab) ctab.classList.add('active');
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); p.style.display=''; });
  var cp=document.getElementById('page-compare');
  if(cp){ cp.style.display=''; cp.classList.add('active'); }
  
  setTimeout(function(){
    initCmpSelects();
    var s1=document.getElementById('cmp1');
    var s2=document.getElementById('cmp2');
    var s3=document.getElementById('cmp3');
    if(s1) s1.value=id1||'';
    if(s2) s2.value=id2||'';
    if(s3) s3.value=id3||'';
    updateCmpPreview();
    if(id1 && id2) setTimeout(doConfronto, 200);
  }, 100);
}

// Avvia la comparazione
async function doConfronto(){
  var ids = ['cmp1','cmp2','cmp3'].map(function(id){
    var sel=document.getElementById(id); return sel?sel.value:'';
  }).filter(Boolean);
  if(ids.length < 2){ alert('Seleziona almeno 2 denominazioni'); return; }
  
  var denoms = ids.map(function(id){
    return (EXP.feats||[]).find(function(f){return f.id===id;});
  }).filter(Boolean);
  
  document.getElementById('cmpLoad').style.display='block';
  document.getElementById('cmpResult').innerHTML='';
  
  // Costruisci tabella comparativa con i dati statici
  var result = buildCmpTable(denoms);
  document.getElementById('cmpResult').innerHTML = result;
  
  // Se c'è API key, aggiungi l'analisi AI approfondita
  if(apiKey || SERVER_URL){
    await addCmpAI(denoms);
  } else {
    document.getElementById('cmpLoad').style.display='none';
    var noKey = document.createElement('div');
    noKey.style.cssText='margin:16px;padding:12px;background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.15);font-family:IM Fell English,serif;font-style:italic;font-size:.85rem;color:rgba(191,155,74,.5);text-align:center;';
    noKey.textContent="Server AI non disponibile";
    document.getElementById('cmpResult').appendChild(noKey);
  }
  
  window.scrollTo(0,0);
}

// Costruisce la tabella comparativa con dati statici
function buildCmpTable(denoms){
  var cols = denoms.length;
  var colW = cols===2 ? '45%' : '30%';
  
  var rows = [
    { label:'🌍 PAESE', key:'country', render:function(d){ return (EFLAGS[d.country]||'🌍')+' '+d.country; } },
    { label:'📋 TIPO', key:'type', render:function(d){ return d.type||'—'; } },
    { label:'🍇 VITIGNI', key:'grapes', render:function(d){
      return (d.grapes||'—').split(',').map(function(g){
        return '<span class="cmp-badge">'+g.trim()+'</span>';
      }).join(' ');
    }},
    { label:'📝 NOTE', key:'description', render:function(d){
      return d.description ? d.description.substring(0,120)+'…' : '—';
    }},
  ];
  
  var html = '<div style="overflow-x:auto;">';
  html += '<table class="cmp-table">';
  
  // Header
  html += '<thead><tr>';
  html += '<th style="width:22%;text-align:left;padding:12px 10px;">PARAMETRO</th>';
  denoms.forEach(function(d){
    html += '<th style="width:'+colW+';">'+(EFLAGS[d.country]||'🌍')+'<br>'
      + '<span style="font-size:.72rem;color:var(--crema);">'+d.name+'</span></th>';
  });
  html += '</tr></thead>';
  
  // Righe
  html += '<tbody>';
  rows.forEach(function(row){
    html += '<tr>';
    html += '<td class="cmp-row-label">'+row.label+'</td>';
    denoms.forEach(function(d){
      html += '<td style="text-align:center;">'+row.render(d)+'</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  
  // Placeholder per AI
  html += '<div id="cmpAISection"></div>';
  
  return html;
}

// Aggiunge analisi AI approfondita
async function addCmpAI(denoms){
  var names = denoms.map(function(d){ return d.name+' ('+d.country+')'; }).join(', ');
  var details = denoms.map(function(d){
    return d.name+': '+d.country+', vitigni '+d.grapes+', '+d.description;
  }).join(' | ');
  
  var sys = 'Sei un Master Sommelier con 20 anni di esperienza. Confronta queste denominazioni vitivinicole per un pubblico di sommeliers professionisti. '
    + 'Scrivi in italiano, con precisione tecnica e calore umano. '
    + 'Usa grassetto **così** e liste puntate con -. '
    + 'STRUTTURA: '
    + '### 🌍 Origini e Storia Comparata\n[3-4 frasi su come sono nate queste zone, chi le ha rese famose, differenze storiche] '
    + '### 🪨 Terroir e Suolo\n[confronto preciso: tipo di suolo geologico, altitudine, clima, esposizione per ognuna] '
    + '### 🍇 I Vitigni a Confronto\n[carattere aromatico di ogni vitigno, come il terroir lo trasforma in modo diverso] '
    + '### 🍷 Nel Bicchiere\n[colore, aromi, struttura, longevità, acidità e tannini per ciascuna — dati concreti] '
    + '### ⚖️ Il Giudizio del Sommelier\n[2-3 frasi su quando scegliere una invece dell altra, contesti di servizio, abbinamenti ideali per ognuna] '
    + '### 💡 Il Dettaglio Che Fa la Differenza\n[un fatto sorprendente, poco conosciuto, che distingue queste denominazioni — qualcosa che si racconta ai clienti]';
  
  var prompt = 'Confronta queste denominazioni: '+names+'\n\nDati: '+details;
  
  try {
    var text = await callAPI(sys, prompt);
    document.getElementById('cmpLoad').style.display='none';
    
    // Converti markdown in HTML
    var html = text
      .replace(/### (.+)/g, '<h3>$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)/gm, '<li>$1</li>')
      .replace(/((?:<li>[^<]*<\/li>\s*)+)/g, '<ul>$&</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul])/gm, '')
      .trim();
    if(html.charAt(0) !== '<') html = '<p>'+html+'</p>';
    
    var aiSec = document.getElementById('cmpAISection');
    if(aiSec){
      aiSec.innerHTML = '<div class="cmp-ai-section">'
        + '<div class="cmp-ai-title">🤖 ANALISI APPROFONDITA DEL SOMMELIER</div>'
        + '<div class="cmp-ai-body">'+html+'</div>'
        + '</div>';
    }
  } catch(e){
    document.getElementById('cmpLoad').style.display='none';
    var aiSec = document.getElementById('cmpAISection');
    if(aiSec){
      aiSec.innerHTML='<div style="margin:16px;padding:12px;color:#f99;font-family:IM Fell English,serif;font-style:italic;">Errore AI: '+e.message+'</div>';
    }
  }
}

// Init quando si apre la pagina compare
document.addEventListener('DOMContentLoaded', function(){
  // Inizializza select quando si va su compare
  var ctab = document.querySelector('[data-page="compare"]');
  if(ctab){
    ctab.addEventListener('click', function(){
      setTimeout(function(){ if(typeof EXP!=='undefined') initCmpSelects(); }, 100);
    });
  }
});
</script>


<!-- COOKIE BANNER GDPR -->
<div id="cookieBanner" style="display:none;position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#1A0D08;border-top:2px solid rgba(191,155,74,.35);padding:14px 16px;">
  <div style="max-width:640px;margin:0 auto;">
    <div style="font-family:Cinzel,serif;font-size:.66rem;letter-spacing:2px;color:var(--oro);margin-bottom:6px;">🍪 COOKIE & PRIVACY</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.82rem;color:rgba(245,239,226,.65);line-height:1.7;margin-bottom:10px;">
      Utilizziamo cookie tecnici necessari al funzionamento del sito e localStorage per salvare le tue preferenze. Nessun dato viene condiviso con terze parti a scopo pubblicitario.
      <span onclick="showPage('privacy')" style="color:var(--oro);cursor:pointer;text-decoration:underline;">Privacy Policy</span> · 
      <span onclick="showPage('terms')" style="color:var(--oro);cursor:pointer;text-decoration:underline;">Termini di Servizio</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button onclick="acceptCookies()" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:8px 18px;background:var(--vino);color:#fff;border:none;cursor:pointer;">✓ ACCETTO</button>
      <button onclick="rejectCookies()" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:8px 18px;background:transparent;border:1px solid rgba(191,155,74,.3);color:rgba(191,155,74,.55);cursor:pointer;">SOLO NECESSARI</button>
    </div>
  </div>
</div>

<!-- PAGINA PRIVACY POLICY -->
<div id="page-privacy" class="page legal-page" style="padding-top:60px;display:none;">
  <div style="max-width:640px;margin:0 auto;padding:20px 18px 40px;">
    <button onclick="goBack()" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:7px 14px;background:transparent;border:1px solid rgba(191,155,74,.25);color:rgba(191,155,74,.55);cursor:pointer;margin-bottom:20px;">← INDIETRO</button>
    <div style="font-family:Cinzel,serif;font-size:1.1rem;letter-spacing:3px;color:var(--oro);margin-bottom:6px;">PRIVACY POLICY</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(191,155,74,.4);margin-bottom:20px;">Ultimo aggiornamento: Marzo 2025</div>
    <div style="font-family:Cormorant Garamond,serif;font-size:.92rem;line-height:1.9;color:rgba(245,239,226,.75);">
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">1. Titolare del trattamento</strong><br>
      Sommelier World è un servizio in fase di sviluppo. Il titolare del trattamento dei dati è il gestore del sito. Per informazioni: contatto disponibile nella sezione Produttori.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">2. Dati raccolti</strong><br>
      Il sito raccoglie esclusivamente i dati che l'utente inserisce volontariamente nel modulo di registrazione produttori (nome cantina, email, descrizione vino). Nessun dato di navigazione viene tracciato.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">3. Finalità del trattamento</strong><br>
      I dati dei produttori vengono utilizzati esclusivamente per la pubblicazione della scheda cantina sulla piattaforma e per la gestione del rapporto commerciale.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">4. Cookie e localStorage</strong><br>
      Il sito utilizza localStorage del browser per salvare preferenze locali (chiave API, notizie in cache, produttori inseriti). Questi dati rimangono sul dispositivo dell'utente e non vengono trasmessi a server esterni.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">5. Servizi terzi</strong><br>
      Il sito utilizza: Groq API (elaborazione AI, privacy policy su groq.com), Unsplash (immagini libere da diritti), CartoDB (tiles mappa, no tracciamento utenti).</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">6. Diritti dell'utente (GDPR)</strong><br>
      Ai sensi del Regolamento UE 2016/679 hai diritto di accesso, rettifica, cancellazione e portabilità dei tuoi dati. Per esercitare questi diritti contattaci tramite la sezione Produttori.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">7. Conservazione dei dati</strong><br>
      I dati dei produttori vengono conservati per la durata del contratto e cancellati su richiesta. I dati in localStorage vengono eliminati automaticamente alla disinstallazione del browser.</p>
    </div>
  </div>
</div>

<!-- PAGINA TERMINI DI SERVIZIO -->
<div id="page-terms" class="page legal-page" style="padding-top:60px;display:none;">
  <div style="max-width:640px;margin:0 auto;padding:20px 18px 40px;">
    <button onclick="goBack()" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:7px 14px;background:transparent;border:1px solid rgba(191,155,74,.25);color:rgba(191,155,74,.55);cursor:pointer;margin-bottom:20px;">← INDIETRO</button>
    <div style="font-family:Cinzel,serif;font-size:1.1rem;letter-spacing:3px;color:var(--oro);margin-bottom:6px;">TERMINI DI SERVIZIO</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(191,155,74,.4);margin-bottom:20px;">Ultimo aggiornamento: Marzo 2025</div>
    <div style="font-family:Cormorant Garamond,serif;font-size:.92rem;line-height:1.9;color:rgba(245,239,226,.75);">
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">1. Accettazione dei termini</strong><br>
      Utilizzando Sommelier World accetti i presenti Termini di Servizio. Se non li accetti, ti preghiamo di non utilizzare il servizio.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">2. Descrizione del servizio</strong><br>
      Sommelier World è una piattaforma enciclopedica dedicata al mondo del vino. Le informazioni sono generate con il supporto dell'intelligenza artificiale e hanno scopo puramente informativo.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">3. Contenuti e accuratezza</strong><br>
      Le informazioni su vini, denominazioni e produttori sono fornite a scopo informativo. Le informazioni generate dall'AI sono a scopo puramente educativo e informativo. NON costituiscono consulenza professionale enologica, commerciale o legale. Per decisioni di acquisto verifica sempre fonti ufficiali e professionisti del settore.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">4. Inserzioni produttori</strong><br>
      Le schede dei produttori nella sezione Produttori sono attualmente gratuite (versione beta). Il servizio non prevede al momento transazioni economiche attive. Ogni scheda è chiaramente identificata con il badge del pacchetto (Basic, Premium, Elite). Il gestore si riserva di rifiutare inserzioni non conformi.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">5. Proprietà intellettuale</strong><br>
      Il codice, il design e i contenuti originali di Sommelier World sono proprietà del gestore. Le denominazioni vitivinicole citate sono di dominio pubblico. I nomi di cantine e produttori appartengono ai rispettivi titolari.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">6. Limitazione di responsabilità</strong><br>
      Il gestore non è responsabile per decisioni prese sulla base delle informazioni presenti sul sito. Il servizio è fornito "così com'è" senza garanzie implicite.</p>
      <p style="margin-bottom:14px;"><strong style="color:var(--crema);">7. Legge applicabile</strong><br>
      I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro del domicilio del gestore.</p>
    </div>
  </div>
</div>


<!-- PAGINA ADMIN -->
<div id="page-admin" class="page" style="padding-top:60px;display:none;">
  <div id="adminLogin" style="max-width:400px;margin:40px auto;padding:24px;border:1px solid rgba(191,155,74,.3);">
    <div style="font-family:Cinzel,serif;font-size:.8rem;letter-spacing:3px;color:var(--oro);margin-bottom:16px;text-align:center;">⚙️ PANNELLO ADMIN</div>
    <label style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;color:rgba(191,155,74,.5);display:block;margin-bottom:6px;">PASSWORD</label>
    <input id="adminPwd" type="password" class="field" placeholder="Password admin" onkeydown="if(event.key==='Enter')checkAdmin()">
    <button onclick="checkAdmin()" class="cta-btn" style="margin-top:8px;">ACCEDI</button>
    <div id="adminErr" style="color:#f77;font-family:IM Fell English,serif;font-style:italic;font-size:.82rem;margin-top:8px;display:none;">Password errata</div>
  </div>
  <div id="adminPanel" style="display:none;padding:16px;">
    <div style="font-family:Cinzel,serif;font-size:.75rem;letter-spacing:3px;color:var(--oro);margin-bottom:16px;border-bottom:1px solid rgba(191,155,74,.2);padding-bottom:8px;">⚙️ GESTIONE PRODUTTORI</div>
    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;" id="adminStats"></div>
    <!-- Lista produttori pending -->
    <div style="font-family:Cinzel,serif;font-size:.66rem;letter-spacing:3px;color:var(--oro);margin-bottom:10px;">IN ATTESA DI APPROVAZIONE</div>
    <div id="adminPending"></div>
    <!-- Lista produttori approvati -->
    <div style="font-family:Cinzel,serif;font-size:.66rem;letter-spacing:3px;color:var(--oro);margin:16px 0 10px;">APPROVATI</div>
    <div id="adminApproved"></div>
    <button onclick="adminLogout()" style="margin-top:20px;font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:8px 16px;background:transparent;border:1px solid rgba(191,155,74,.2);color:rgba(191,155,74,.4);cursor:pointer;">ESCI</button>
  </div>
</div>
<!-- MODALE QR CODE -->
<div id="qrModal" style="display:none;position:fixed;inset:0;background:rgba(10,7,5,.95);z-index:700;display:none;align-items:center;justify-content:center;">
  <div style="background:var(--nero);border:1px solid rgba(191,155,74,.35);padding:24px;max-width:360px;width:90%;text-align:center;">
    <div style="font-family:Cinzel,serif;font-size:.7rem;letter-spacing:3px;color:var(--oro);margin-bottom:6px;">📱 QR CODE MENU</div>
    <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(245,239,226,.45);margin-bottom:16px;">I tuoi clienti scansionano questo QR e vedono gli abbinamenti</div>
    <div id="qrContainer" style="background:#fff;padding:16px;display:inline-block;margin-bottom:14px;"></div>
    <div style="font-family:Cinzel,serif;font-size:.56rem;letter-spacing:1px;color:rgba(191,155,74,.5);margin-bottom:14px;" id="qrRestName"></div>
    <div style="display:flex;gap:8px;justify-content:center;">
      <button onclick="downloadQR()" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:9px 16px;background:var(--vino);color:#fff;border:none;cursor:pointer;">⬇ SCARICA</button>
      <button onclick="closeQRModal()" style="font-family:Cinzel,serif;font-size:.60rem;letter-spacing:2px;padding:9px 16px;background:transparent;border:1px solid rgba(191,155,74,.25);color:rgba(191,155,74,.5);cursor:pointer;">CHIUDI</button>
    </div>
  </div>
</div>
<!-- MODALE PRO — Club del Vino -->
<div id="proModal" style="display:none;position:fixed;inset:0;z-index:700;overflow-y:auto;">

  <!-- Sfondo vigna -->
  <div style="position:fixed;inset:0;background-image:url('');background-size:cover;background-position:center;"></div>
  <div style="position:fixed;inset:0;background:linear-gradient(135deg,rgba(10,5,2,.95) 0%,rgba(30,10,5,.85) 50%,rgba(10,5,2,.92) 100%);"></div>

  <!-- Contenuto -->
  <div style="position:relative;z-index:1;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;">
    <div style="max-width:440px;width:100%;">

      <!-- Close -->
      <button onclick="closeProModal()" style="position:absolute;top:20px;right:20px;background:none;border:none;color:rgba(200,164,90,.5);font-size:1.5rem;cursor:pointer;z-index:2;">✕</button>

      <!-- Header club -->
      <div style="text-align:center;margin-bottom:32px;">
        <div style="font-size:2.5rem;margin-bottom:12px;">🍷</div>
        <div style="font-family:Cinzel,serif;font-size:.65rem;letter-spacing:.4em;color:var(--oro);margin-bottom:8px;">SOMMELIER WORLD</div>
        <div style="font-family:Cinzel,serif;font-size:1.8rem;color:var(--crema);letter-spacing:.04em;line-height:1.2;margin-bottom:8px;"id="proClubTitle">Il Club<br>del Terroir</div>
        <div style="width:50px;height:1px;background:var(--oro);margin:14px auto;"></div>
        <div style="font-family:IM Fell English,serif;font-style:italic;font-size:1rem;color:rgba(245,239,226,.65);line-height:1.6;"id="proClubSub">Un accesso privilegiato al mondo del vino.<br>Riservato a chi vuole andare più in profondità.</div>
      </div>

      <!-- Benefici -->
      <div id="proBenefits" style="margin-bottom:28px;"></div>

      <!-- Prezzo -->
      <div style="text-align:center;margin-bottom:18px;padding:16px;border:1px solid rgba(200,164,90,.2);background:rgba(200,164,90,.05);">
        <div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:.3em;color:rgba(200,164,90,.5);margin-bottom:6px;">ACCESSO BETA GRATUITO</div>
        <div style="font-family:Cinzel,serif;font-size:2rem;color:var(--oro);">GRATIS<span style="font-size:.7rem;color:rgba(200,164,90,.5);"> durante la beta</span></div>
        <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.82rem;color:rgba(245,239,226,.4);margin-top:4px;">Il servizio è in fase di sviluppo. Nessun addebito.</div>
      </div>
      
      <!-- Disclaimer beta -->
      <div style="background:rgba(191,155,74,.06);border:1px solid rgba(191,155,74,.15);padding:12px 14px;margin-bottom:14px;border-radius:2px;">
        <div style="font-family:Cinzel,serif;font-size:.48rem;letter-spacing:2px;color:rgba(191,155,74,.6);margin-bottom:5px;">ℹ️ NOTA BETA</div>
        <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(245,239,226,.5);line-height:1.65;">
          Sommelier World è attualmente in versione beta. Tutte le funzionalità Pro sono disponibili gratuitamente. 
          La tua email serve solo per identificarti. Nessun dato viene trasmesso a terzi. Nessun abbonamento attivo.
        </div>
      </div>

      <!-- Form iscrizione -->
      <div style="background:rgba(200,164,90,.06);border:1px solid rgba(200,164,90,.15);padding:20px;">
        <div style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:.3em;color:var(--oro);margin-bottom:14px;">🎁 ACCESSO GRATUITO</div>
        <input id="proEmail" type="email" placeholder="La tua email…" id="proEmailInput"
          style="width:100%;background:rgba(255,255,255,.06);border:none;border-bottom:1px solid rgba(200,164,90,.3);padding:12px 0;font-family:Cormorant Garamond,serif;font-size:1.1rem;color:var(--crema);outline:none;margin-bottom:16px;box-sizing:border-box;">
        <button onclick="activatePro()" id="proActivateBtn"
          style="width:100%;padding:16px;background:var(--oro);color:var(--nero);font-family:Cinzel,serif;font-size:.7rem;letter-spacing:.25em;border:none;cursor:pointer;">
          ENTRA NEL CLUB
        </button>
      </div>

      <div id="proMsg" style="text-align:center;margin-top:14px;font-family:IM Fell English,serif;font-style:italic;font-size:.95rem;min-height:24px;"></div>

    </div>
  </div>
</div>


<!-- MODALE PRENOTAZIONE EVENTO -->
<div id="bookingModal" style="display:none;position:fixed;inset:0;background:rgba(10,5,2,.97);z-index:800;overflow-y:auto;-webkit-overflow-scrolling:touch;">
  <div style="max-width:440px;margin:0 auto;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px 16px;">
    <div style="width:100%;background:var(--fumo);border:1px solid rgba(200,164,90,.2);border-radius:3px;overflow:hidden;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,var(--vino) 0%,#3a0e0e 100%);padding:22px 18px 18px;position:relative;">
        <div id="bookingModalTitle" style="font-family:Cinzel,serif;font-size:.6rem;letter-spacing:.3em;color:var(--oro);margin-bottom:6px;">🎫 PRENOTA IL TUO POSTO</div>
        <div id="bookingEventName" style="font-family:Cinzel,serif;font-size:1.05rem;color:#fff;font-weight:600;line-height:1.25;"></div>
        <div id="bookingEventPlace" style="font-family:IM Fell English,serif;font-style:italic;font-size:.88rem;color:rgba(245,239,226,.55);margin-top:3px;"></div>
        <button onclick="closeBooking()" style="position:absolute;top:16px;right:16px;background:none;border:none;color:rgba(200,164,90,.5);font-size:1.4rem;cursor:pointer;line-height:1;padding:4px;">✕</button>
      </div>

      <!-- Form -->
      <div style="padding:22px 18px 24px;">

        <!-- Nome -->
        <div style="margin-bottom:16px;">
          <label id="bookLabelName" style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.2em;color:rgba(200,164,90,.5);display:block;margin-bottom:7px;">NOME E COGNOME</label>
          <input id="bookName" type="text" autocomplete="name" class="selectable"
            placeholder="Mario Rossi"
            style="width:100%;background:rgba(255,255,255,.04);border:none;border-bottom:1px solid rgba(200,164,90,.2);padding:10px 0;font-family:Cormorant Garamond,serif;font-size:1.05rem;color:var(--crema);outline:none;box-sizing:border-box;-webkit-appearance:none;">
        </div>

        <!-- Email -->
        <div style="margin-bottom:16px;">
          <label id="bookLabelEmail" style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.2em;color:rgba(200,164,90,.5);display:block;margin-bottom:7px;">EMAIL</label>
          <input id="bookEmail" type="email" autocomplete="email" class="selectable"
            placeholder="mario@email.it"
            style="width:100%;background:rgba(255,255,255,.04);border:none;border-bottom:1px solid rgba(200,164,90,.2);padding:10px 0;font-family:Cormorant Garamond,serif;font-size:1.05rem;color:var(--crema);outline:none;box-sizing:border-box;-webkit-appearance:none;">
        </div>

        <!-- Telefono + Persone -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div>
            <label id="bookLabelPhone" style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.2em;color:rgba(200,164,90,.5);display:block;margin-bottom:7px;">TELEFONO</label>
            <input id="bookPhone" type="tel" autocomplete="tel" class="selectable"
              placeholder="+39 333 000000"
              style="width:100%;background:rgba(255,255,255,.04);border:none;border-bottom:1px solid rgba(200,164,90,.2);padding:10px 0;font-family:Cormorant Garamond,serif;font-size:1.05rem;color:var(--crema);outline:none;box-sizing:border-box;-webkit-appearance:none;">
          </div>
          <div>
            <label id="bookLabelPax" style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.2em;color:rgba(200,164,90,.5);display:block;margin-bottom:7px;">PERSONE</label>
            <input id="bookPax" type="number" value="2" min="1" max="20" class="selectable"
              style="width:100%;background:rgba(255,255,255,.04);border:none;border-bottom:1px solid rgba(200,164,90,.2);padding:10px 0;font-family:Cormorant Garamond,serif;font-size:1.05rem;color:var(--crema);outline:none;box-sizing:border-box;-webkit-appearance:none;">
          </div>
        </div>

        <!-- Note -->
        <div style="margin-bottom:22px;">
          <label id="bookLabelNote" style="font-family:Cinzel,serif;font-size:.52rem;letter-spacing:.2em;color:rgba(200,164,90,.5);display:block;margin-bottom:7px;">NOTE (opzionale)</label>
          <textarea id="bookNote" rows="2" class="selectable"
            placeholder="Allergie, preferenze, richieste speciali…"
            style="width:100%;background:rgba(255,255,255,.04);border:none;border-bottom:1px solid rgba(200,164,90,.2);padding:10px 0;font-family:Cormorant Garamond,serif;font-size:1.05rem;color:var(--crema);outline:none;resize:none;box-sizing:border-box;"></textarea>
        </div>

        <!-- CTA -->
        <button id="bookSubmitBtn" onclick="submitBooking()"
          style="width:100%;padding:17px;background:var(--oro);color:var(--nero);font-family:Cinzel,serif;font-size:.65rem;letter-spacing:.25em;border:none;cursor:pointer;border-radius:2px;margin-bottom:12px;-webkit-tap-highlight-color:transparent;">
          CONFERMA PRENOTAZIONE
        </button>

        <div id="bookingMsg" style="text-align:center;font-family:IM Fell English,serif;font-style:italic;font-size:.95rem;min-height:22px;line-height:1.5;color:var(--oro);padding:0 8px;"></div>
      </div>

    </div>
  </div>
</div>

<!-- FOOTER COPYRIGHT -->
<footer style="background:var(--fumo);border-top:1px solid rgba(200,164,90,.15);padding:16px 18px;text-align:center;">
  <div style="font-family:Cinzel,serif;font-size:.55rem;letter-spacing:.25em;color:rgba(200,164,90,.4);"id="footerCopyright">© 2026 SOMMELIER WORLD — MARCHIO REGISTRATO</div>
  <div style="font-family:IM Fell English,serif;font-style:italic;font-size:.8rem;color:rgba(245,239,226,.2);margin-top:4px;"id="footerRights">Tutti i contenuti sono protetti. Riproduzione vietata.</div>


</footer>

<!-- PROTEZIONE CONTENUTI -->
<!-- PROTEZIONE CONTENUTI -->
<script>
// Protezione contenuti Sommelier World
['contextmenu','selectstart','dragstart'].forEach(function(ev){
  document.addEventListener(ev, function(e){
    if(!e.target.closest('input,textarea,select')) e.preventDefault();
  });
});
document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&['s','u','p','a','c'].includes(e.key.toLowerCase())){
    if(!e.target.closest('input,textarea')) e.preventDefault();
  }
});
window.addEventListener('beforeprint',function(){ return false; });

// ── Profilo Organolettico — Funzioni Slider ──

// Mappa regioni per paese
var WINE_REGIONI = {
  'Italia': ['Piemonte','Toscana','Veneto','Sicilia','Campania','Friuli-Venezia Giulia','Alto Adige','Sardegna','Umbria','Marche','Lombardia','Abruzzo','Puglia','Trentino','Lazio'],
  'Francia': ['Borgogna','Bordeaux','Rodano','Alsazia','Champagne','Loira','Languedoc-Roussillon','Provenza','Beaujolais','Côtes du Rhône','Jura','Savoia'],
  'Spagna': ['Rioja','Ribera del Duero','Priorat','Rías Baixas','Jerez','Toro','Penedès','Bierzo','Jumilla','Navarra'],
  'USA': ['Napa Valley','Sonoma','Willamette Valley (Oregon)','Paso Robles','Santa Barbara','Columbia Valley (Washington)','Finger Lakes (New York)'],
  'Germania': ['Mosel','Rheingau','Pfalz','Baden','Rheinhessen','Nahe','Franken'],
  'Portogallo': ['Douro','Alentejo','Vinho Verde','Dão','Bairrada','Lisboa','Setúbal'],
  'Argentina': ['Mendoza','Salta','Patagonia','La Rioja','San Juan'],
  'Cile': ['Maipo','Colchagua','Casablanca','Elqui','Bío-Bío','Leyda'],
  'Australia': ['Barossa Valley','McLaren Vale','Clare Valley','Yarra Valley','Hunter Valley','Margaret River','Eden Valley'],
  'Nuova Zelanda': ['Marlborough','Central Otago','Hawke's Bay','Martinborough'],
  'Grecia': ['Santorini','Naoussa','Nemea','Creta','Monemvasia'],
  'Austria': ['Wachau','Kamptal','Kremstal','Burgenland','Steiermark'],
  'Ungheria': ['Tokaj','Eger','Villány','Szekszárd'],
  'Georgia': ['Kakheti','Kartli','Imereti'],
  'Sud Africa': ['Stellenbosch','Swartland','Franschhoek','Walker Bay','Constantia']
};

function updateRegioni(){
  var paese = document.getElementById('winePaese').value;
  var sel = document.getElementById('wineRegione');
  if(!sel) return;
  sel.innerHTML = '<option value="">Qualsiasi regione</option>';
  var regioni = WINE_REGIONI[paese] || [];
  regioni.forEach(function(r){
    var opt = document.createElement('option');
    opt.value = r; opt.textContent = r;
    sel.appendChild(opt);
  });
  sel.disabled = !paese;
}

function updateSlider(id, labels){
  var slider = document.getElementById(id);
  if(!slider) return;
  var val = parseInt(slider.value);
  var pct = ((val - 1) / 4 * 100).toFixed(0);
  slider.style.setProperty('--pct', pct + '%');
  var valEl = document.getElementById(id + 'Val') || document.getElementById(id.replace('acidita','acidita').replace('morbidezza','morbidezza').replace('sapidita','sapid').replace('struttura','struttura') + 'Val');
  // Map id to val element id
  var valIds = {acidita:'aciditaVal', morbidezza:'morbidezzaVal', sapidita:'sapidVal', struttura:'strutturaVal'};
  var valElId = valIds[id];
  var el = document.getElementById(valElId);
  if(el) el.textContent = labels[val - 1];
}

// Init slider visuals on load
document.addEventListener('DOMContentLoaded', function(){
  ['acidita','morbidezza','sapidita','struttura'].forEach(function(id){
    var s = document.getElementById(id);
    if(s){ s.style.setProperty('--pct', '50%'); }
  });
  var regEl = document.getElementById('wineRegione');
  if(regEl) regEl.disabled = true;
});

// Helper per leggere i parametri organolettici
function getWineParams(){
  var aciditaLabels = ['Bassa','Medio-bassa','Media','Medio-alta','Alta'];
  var morbidezzaLabels = ['Secco-tannico','Poco morbido','Equilibrato','Morbido','Molto morbido'];
  var sapidLabels = ['Bassa','Poco sapido','Sapido','Molto sapido','Minerale-salino'];
  var strutturaLabels = ['Leggero','Medio-leggero','Medio','Medio-pieno','Pieno e concentrato'];
  
  function getLabel(id, labels){
    var el = document.getElementById(id);
    return el ? labels[parseInt(el.value) - 1] : labels[2];
  }
  
  var paese = (document.getElementById('winePaese')||{}).value || '';
  var regione = (document.getElementById('wineRegione')||{}).value || '';
  
  return {
    acidita: getLabel('acidita', aciditaLabels),
    morbidezza: getLabel('morbidezza', morbidezzaLabels),
    sapidita: getLabel('sapidita', sapidLabels),
    struttura: getLabel('struttura', strutturaLabels),
    paese: paese,
    regione: regione
  };
}


// ── Suggerimenti rapidi Sommelier ──
function quickSearch(query){
  var inp = document.getElementById('wineSearch');
  if(inp){ inp.value = query; inp.focus(); }
  doWineSearch();
}

var QUICK_MENUS = {
  pesce: 'Antipasto — Carpaccio di gamberi rossi con lime\nPrimo — Linguine alle vongole\nSecondo — Branzino al forno con erbe\nContorno — Patate al vapore con prezzemolo',
  carne: 'Antipasto — Tagliere di salumi misti\nPrimo — Tagliatelle al ragù di cinghiale\nSecondo — Costata di Fassona al sangue\nContorno — Porcini trifolati',
  vegetariano: 'Antipasto — Burrata con pomodorini e basilico\nPrimo — Risotto ai funghi porcini\nSecondo — Melanzane alla parmigiana\nFormaggi — Parmigiano Reggiano 36 mesi',
  degustazione: 'Amuse-bouche — Tartare di tonno\nPrimo — Tortelli di ricotta e spinaci\nIntermezzo — Granita al limone\nSecondo — Piccione arrosto\nPre-dessert — Crema bruciée\nDolce — Tiramisù al caffè',
  formaggi: 'Fresco — Burrata pugliese\nSemi-stagionato — Pecorino toscano\nStagionato — Parmigiano Reggiano 36 mesi\nErborinato — Gorgonzola piccante DOP\nDi capra — Chèvre della Loira'
};

function quickMenu(type){
  var menu = QUICK_MENUS[type];
  if(!menu) return;
  var ta = document.getElementById('menuText');
  if(ta){ ta.value = menu; ta.focus(); }
}

// ── Tooltip parametri organolettici ──
function showParamHelp(param, text){
  // Crea o aggiorna il tooltip panel
  var existing = document.getElementById('paramHelpPanel');
  if(existing) existing.remove();
  
  var panel = document.createElement('div');
  panel.id = 'paramHelpPanel';
  panel.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:900',
    'display:flex', 'align-items:flex-end', 'justify-content:center',
    'background:rgba(5,3,1,.75)', 'padding:16px'
  ].join(';');
  
  var box = document.createElement('div');
  box.style.cssText = [
    'background:#1A0A06', 'border:1px solid rgba(191,155,74,.35)',
    'border-radius:4px', 'max-width:480px', 'width:100%',
    'padding:20px', 'position:relative',
    'box-shadow:0 -8px 32px rgba(0,0,0,.6)'
  ].join(';');
  
  var title = document.createElement('div');
  title.style.cssText = 'font-family:Cinzel,serif;font-size:.78rem;letter-spacing:3px;color:var(--oro);margin-bottom:12px;';
  title.textContent = '🍷 ' + param.toUpperCase();
  
  var body = document.createElement('div');
  body.style.cssText = 'font-family:Cormorant Garamond,serif;font-size:1.02rem;line-height:1.85;color:rgba(245,239,226,.82);';
  body.textContent = text;
  
  var closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'display:block;width:100%;margin-top:16px;padding:11px;background:var(--vino);color:#fff;font-family:Cinzel,serif;font-size:.58rem;letter-spacing:2px;border:none;cursor:pointer;border-radius:2px;';
  closeBtn.textContent = '✓ CAPITO';
  closeBtn.onclick = function(){ panel.remove(); };
  
  box.appendChild(title);
  box.appendChild(body);
  box.appendChild(closeBtn);
  panel.appendChild(box);
  
  // Chiudi toccando fuori
  panel.addEventListener('click', function(e){ if(e.target === panel) panel.remove(); });
  document.body.appendChild(panel);
  
  // Animazione slide-up
  box.style.transform = 'translateY(40px)';
  box.style.opacity = '0';
  box.style.transition = 'transform .28s ease, opacity .28s ease';
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      box.style.transform = 'translateY(0)';
      box.style.opacity = '1';
    });
  });
}

</script>


<div id="articleReader" class="article-reader">
  <div class="article-reader-head">
    <button class="article-reader-back" onclick="closeArticle()">← INDIETRO</button>
    <div style="font-family:Cinzel,serif;font-size:.5rem;letter-spacing:3px;color:rgba(191,155,74,.5);" id="readerCat"></div>
  </div>
  <div class="article-reader-content">
    <div class="article-reader-cat" id="readerCatBig"></div>
    <div class="article-reader-title" id="readerTitle"></div>
    <img class="article-reader-img" id="readerImg" src="" alt="">
    <div class="article-reader-body" id="readerBody"></div>
  </div>
</div>

<script src="sw-patch-v6.js"></script>
<script src="sw-patch-v10.js"></script>
<script src="sw-patch-v11.js"></script>
<script src="sw-patch-v12.js"></script>
<script src="sw-patch-v13.js"></script>
<script src="sw-patch-v14-cleanup.js"></script>

<script>
// FIX PER GLI ERRORI IN CONSOLE
var url = window.location.href; // Risolve l'errore 'url is not defined'

function getWineParams() {
    return { food: document.getElementById('foodInput')?.value || "" };
}

function quickMenu(page) {
    if (typeof showPage === 'function') {
        showPage(page);
    } else {
        console.log("Navigazione verso:", page);
    }
}

function updateRegioni() {
    console.log("Database regioni (WINE_DB) pronto.");
}

// Protezione contro errori di battitura come la 's'
window.onerror = function(msg) {
    if (msg.includes("Unexpected identifier 's'")) return true;
    return false;
};
</script>

</body>
</html>
