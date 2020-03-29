import React from "react";
import Canvas from "./Canvas";

const downloadAll = 1;
const encryptAll = 2;
const decryptAll = 3;

class ImageSelectorAndContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: "#ffffff",
      canvasData: [],
      downloadAll: 0,
      encryptAll: 0,
      decryptAll: 0,
      imageFile: "",
      encryptionKey: ""
    }
    this.handleChange = this.handleChange.bind(this)
    this.publishTaskClicked = this.publishTaskClicked.bind(this);
    this.handleInputChangeEncryptionKey = this.handleInputChangeEncryptionKey.bind(this);
  }

  handleChange(event) {
    if (this.state.encryptionKey == "") {
      alert("Please enter the encryption key before select your images.");
    }
    else {
      console.log(event.target.files)
      if (event.target.files.length > 0) {
        let canvasData = [];
        for (let index = 0; index < event.target.files.length; index++) {
          canvasData.push({
            key: index,
            imageFile: URL.createObjectURL(event.target.files[index]),
          });

        }
        this.setState({
          canvasData: canvasData
        })
      }
    }
    event.target.value = null;
  }

  publishTaskClicked(taskNum) {
    // switch (taskNum) {
    //   case downloadAll:
    //     console.log("downoad");
    //     this.setState({
    //       downloadAll: this.state.downloadAll + 1,
    //     })
    //     break;
    //   case encryptAll:
    //     this.setState({
    //       encryptAll: this.state.encryptAll + 1
    //     })
    //     break;
    //   case decryptAll:
    //     this.setState({
    //       decryptAll: this.state.decryptAll + 1
    //     })
    //     break;
    // }
  }

  handleInputChangeEncryptionKey(e) {
    console.log(e);
    this.setState({ encryptionKey: e.target.value });
  }


  render() {
    return (
      <div style={{ borderStyle: "solid", borderColor: this.state.color, backgroundColor: "#ffffff" }}>
        <div style={{ margin: "20px" }}>
          <input type="text" style={{ marginBottom: "20px" }} class="form-control" placeholder="Encryptio Key" aria-label="Recipient's username" aria-describedby="basic-addon2" value={this.state.encryptionKey} onChange={this.handleInputChangeEncryptionKey} />

          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
            </div>
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="inputGroupFile01"
                aria-describedby="inputGroupFileAddon01" multiple="multiple" onChange={this.handleChange} />
              <label class="custom-file-label" for="inputGroupFile01">Choose image files</label>
            </div>
          </div>


          <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              {this.state.canvasData.map(
                (element) => {
                  return <Canvas key={element.key} imageFile={element.imageFile} downloadAll={this.state.downloadAll} encryptAll={this.state.encryptAll} decryptAll={this.state.decryptAll} encryptionKey={this.state.encryptionKey} />
                }
              )}
            </div>
          </div>
        </div>
      </div>



    );
  }
}

export default ImageSelectorAndContainer;