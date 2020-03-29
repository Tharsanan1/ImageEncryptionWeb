import React from "react";
import SeedRandom from "seedrandom";
import CircularProgress from '@material-ui/core/CircularProgress';

function encrypt(imageData, ctx, rotateFunction, encryptionKey) {
    if(encryptionKey === ""){
        alert("Please provide a encryption key");
        return;
    }
    let random = SeedRandom(encryptionKey);
    let max = 257;
    let min = 0;
    for (let index = 0; index < imageData.data.length / 4; index++) {
        let randomNum = () => Math.floor(random() * (max - min)) + min;
        let colorData = getPixel(imageData, index);
        colorData[0] = rotateFunction(colorData[0], randomNum());
        colorData[1] = rotateFunction(colorData[1], randomNum());
        colorData[2] = rotateFunction(colorData[2], randomNum());
        setPixelXY(imageData, Math.floor(index % imageData.width), Math.floor(index / imageData.width), colorData[0], colorData[1], colorData[2], 255);
    }
    ctx.putImageData(imageData, 0, 0);

}


let count = 0;

function rightRotate(source, diff) {
    let circleSize = 256;
    let rotatedVal = (source + diff) % circleSize;
    if (rotatedVal < 0 || rotatedVal > 255) {
        alert("wrong");
    }
    return (source + diff) % circleSize;
}

function leftRotate(source, diff) {
    let circleSize = 256;
    if (source >= diff) {
        return source - diff;
    }
    else {
        return circleSize - (diff - source);
    }
}
// function delayedWipe(imageData, ctx) {
//     setTimeout(() => {
//         if (count < imageData.data.length / 4) {
//             let index = count;
//             let start = index;
//             let factor = 1;
//             let temp = imageData.width * factor;
//             while (temp > 0) {
//                 count++;
//                 setPixelXY(imageData, Math.floor(index % imageData.width), Math.floor(index / imageData.width), 255, 127, 0, 255);
//                 index++
//                 temp--;
//             }
//             index = start;
//             ctx.putImageData(imageData, 0, 0, Math.floor(index % imageData.width), Math.floor(index / imageData.width), imageData.width, factor);
//             delayedWipe(imageData, ctx);
//         }
//         else {
//             ctx.putImageData(imageData, 0, 0);
//         }
//     }, 1);
// }


function getPixel(imgData, index) {
    var i = index * 4, d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}

function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}

function setPixel(imgData, index, r, g, b, a) {
    var i = index * 4, d = imgData.data;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = a;
}

function setPixelXY(imgData, x, y, r, g, b, a) {
    return setPixel(imgData, y * imgData.width + x, r, g, b, a);
}

class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            downloadAll: 0,
            encryptAll: 0,
            decryptAll: 0,
            fixedSize : "500px",
            inProgress : false
        };
        this.canvas = React.createRef();
        this.image = React.createRef();
        this.decryptClicked = this.decryptClicked.bind(this);
        this.encryptClicked = this.encryptClicked.bind(this);
        this.downloadImage = this.downloadImage.bind(this);
    }

    // componentDidUpdate() {
    //     console.log("did update : ");
    //     const canvas = this.canvas.current;
    //     const ctx = canvas.getContext("2d");
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     const img = this.image.current;
    //     img.onload = () => {
    //         console.log(this.props.imageFile);
    //         this.setState({
    //             width: img.width,
    //             height: img.height
    //         }, () => {
    //             ctx.drawImage(img, 0, 0);

    //         })
    //     }
    // }

    componentDidMount() {
        console.log("did mount : ");
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = this.image.current;
        img.onload = () => {
            console.log(this.props.imageFile);
            this.setState({
                width: img.width,
                height: img.height
            }, () => {
                ctx.drawImage(img, 0, 0);

            })
        }
    }

    decryptClicked() {
        this.setState({inProgress:true},
            () => {
                const canvas = this.canvas.current;
                const ctx = canvas.getContext("2d");
                let imageData = ctx.getImageData(0, 0, this.state.width, this.state.height);
                encrypt(imageData, ctx, (source, diff) => {
                    return leftRotate(source, diff);
                }, this.props.encryptionKey);
                this.setState({inProgress:false})
            })
    }

    encryptClicked() {
        this.setState({inProgress:true},
            () => {
                const canvas = this.canvas.current;
                const ctx = canvas.getContext("2d");
                let imageData = ctx.getImageData(0, 0, this.state.width, this.state.height);
                encrypt(imageData, ctx, (source, diff) => {
                    return rightRotate(source, diff);
                }, this.props.encryptionKey);
                this.setState({inProgress:false})
            })
        
    }

    downloadImage() {
        var lnk = document.createElement('a'), e;

        /// the key here is to set the download attribute of the a tag
        lnk.download = "filename";

        /// convert canvas content to data-uri for link. When download
        /// attribute is set the content pointed to by link will be
        /// pushed as "download" in HTML5 capable browsers
        lnk.href = this.canvas.current.toDataURL("image/png;base64");

        /// create a "fake" click-event to trigger the download
        if (document.createEvent) {
            e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, true, window,
                0, 0, 0, 0, 0, false, false, false,
                false, 0, null);

            lnk.dispatchEvent(e);
        } else if (lnk.fireEvent) {
            lnk.fireEvent("onclick");
        }
    }

    render() {
        return (
            <div className="card" style={{ margin: "20px", backgroundColor: "#ffffff" }}>
                <div className="card-body">
                    <button style={{ margin: "20px" }} className="btn btn-primary" onClick={() => this.downloadImage()}>download</button>
                    <button style={{ margin: "20px" }} className="btn btn-danger" onClick={() => this.encryptClicked()}>encrypt</button>
                    <button style={{ margin: "20px" }} className="btn btn-success" onClick={() => this.decryptClicked()}>decrypt</button>
                    <div >
                    {this.state.inProgress===true?<CircularProgress />:<div/>}
    </div>
                    <div style={{ width: this.state.fixedSize, maxWidth: this.state.fixedSize, height: this.state.fixedSize, maxHeight: this.state.fixedSize, overflow: "scroll" }}>
                        <canvas ref={this.canvas} width={this.state.width} height={this.state.height} />
                    </div>
                    <img ref={this.image} src={this.props.imageFile} style={{ display: "none" }} />
                </div>
            </div>
        )
    }
}
export default Canvas