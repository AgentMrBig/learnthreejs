var hoverBoxShadow = '0px 0px 12px rgba(0,255,255,0.75)';
var hoverBorder = '1px solid rgba(127,255,255,0.75)';
var elementBoxShadow = '0px 0px 12px rgba(0,255,255,0.5)';
var elementBorder = '1px solid rgba(127,255,255,0.25)';


// function hoverEnterEffect(e) {
//     e.preventDefault();
//     e.target.style.cssText = `
//         box-shadow: ${hoverBoxShadow};
//         border: ${hoverBorder};
//     `

// }

// function hoverExitEffect(e) {
//     e.preventDefault();
//     e.target.style.cssText = `
//         box-shadow: ${elementBoxShadow};
//         border: ${elementBorder};
//     `
// }

var elementStyle = `
    height: 160px;
    width: 120px;
    box-shadow: ${elementBoxShadow};
    border: ${elementBorder};
    font-family: Helvetica, sans-serif;
    text-align: center;
    cursor: default;
`

var cardStyle = `
    display: flex;
    
    width: 250px;
    height: 350px;
    border-radius: 5px;
    box-shadow: ${elementBoxShadow};
    border: ${elementBorder};
    font-family: Helvetica, sans-serif;
    text-align: center;
    line-height: normal;
    cursor: default;
    
`

var curExchangeStyle = `
    border: 1px solid red;
    height: 50px;
    width: 100px;

`

var detailsStyle = `
    position: absolute;
    bottom: 15px;
    left: 0px;
    right: 0px;
    font-size: 12px;
    color: rgba(127,255,255,0.75);
`

var symbolStyle = `
    position: absolute;
    top: 40px;
    left: 0px;
    right: 0px;
    font-size: 60px;
    font-weight: bold;
    color: rgba(255,255,255,0.75);
    text-shadow: 0 0 10px rgba(0,255,255,0.95);
`

var numberStyle = `
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(127,255,255,0.75);
`


function DomStyle() {


}

