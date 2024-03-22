# Zoom Chat to Markers

> [Confluence Wiki on Development](https://collegeboard.atlassian.net/wiki/spaces/ITP/pages/266895773/Dev+on+Premiere+Pro+Panel+Zoom+Chat+to+Markers)

## Setup

### Development

Follow steps outlined in this [`README.md`](https://github.com/cb-rnag/PPro-Extension-Zoom-Chat-To-Markers/blob/main/ZoomChatToMarkers/ReadMe.md).

Download and checkout the project, then `cd` into the project folder and create a symlink using the `ZoomChatToMarkers/` folder to the directory where Adobe Premiere searches for extensions:

Clone the project with `git`:

```sh
git clone https://github.com/cb-rnag/PPro-Extension-Zoom-Chat-To-Markers.git
```

cd into the project directory:

```sh
cd PPro-Extension-Zoom-Chat-To-Markers
```

Create a symlink using the `ZoomChatToMarkers/` folder to the directory where Adobe Premiere searches for extensions:

```sh
sudo ln -s "${PWD}/ZoomChatToMarkers" "/Library/Application Support/Adobe/CEP/extensions/ZoomChatToMarkers"
```

Open a sample project in Adobe Premiere Pro.

Select the extension in the top menu bar, `Window > Extensions > Zoom Chat to Markers`. You should see a window pane pop up.

Open the project in an IDE.

Make a change to the UI in `ZoomChatToMarkers/index.html`, and hit “Refresh Panel” in the extension popup window.
You should see new UI changes reflected in Premiere.

You are now set for development!

### Publish to Adobe Exchange

#### Cert Password

Certificate Password is saved in SSM Parameter in our `apdaily-prod` AWS account.

It is saved under [`/adobe/extension/zoom-chat-to-markers/cert-password`](https://us-east-1.console.aws.amazon.com/systems-manager/parameters/%2Fadobe%2Fextension%2Fzoom-chat-to-markers%2Fcert-password/description?region=us-east-1).

Copy the password and save it to a `.password` file.

#### Build `.zxp` File

If publishing a new version, update the version number in the `CSXS/manifest.xml` file.

Run the `build.sh` script to package the plugin directory into a `ZoomChatToMarkers.zxp` file.

Create a new version for the plugin, and upload the `.zxp` file [here](https://developer.adobe.com/distribute/listings/1940358/ZXP/201500/overview).

## Sample extensions

These samples demonstrate techniques for building an extension with an HTML5 UI and behavior implemented in JavaScript.

The samples are kept up to date with the latest CC2018 host applications. Make sue to check the `manifest.xml` file for each sample's compatible host applications. To run the extensions you must have the compatible host application installed. Requirements for each sample are listed below.

Each version of CEP comes with its own samples in the [CEP-Resources repository](https://github.com/Adobe-CEP/CEP-Resources). Under each version name, `CEP_N.x`, you will find the version specific samples, which cover broad use cases and topics of CEP.

Unlike the samples in the [CEP-Resources repository](https://github.com/Adobe-CEP/CEP-Resources), samples in this repository cover specific use cases covering a wide variety of topics. Check out the next section to choose a sample that suits your need.

### Before running the samples

1. The provided samples are unsigned. This will cause the signature check (built into CEP when first running an extension) to fail. To bypass the signature check, please refer to [the documentation](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#debugging-unsigned-extensions).
1. Although these extensions are initially setup for a particular version of CEP, you can adjust the product version targeted by modifying the range inside the `HostList` element of the `CSXS/manifest.xml` file.
1. Some folders have a nested folder strucutre. For those samples, you will need to extract sub-directories into [the extension folder](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#extension-folders).

### Samples list

| Extension                                                                        | Description                                                                                        | Supported Products |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------ |
| [Premiere Pro Panel](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel) | Demonstrates a Premiere Pro panel.                                                                 | Premiere Pro       |
| [TypeScript](https://github.com/Adobe-CEP/Samples/tree/master/TypeScript)        | Demonstrates multiple sample codes thata demonstrate what's possible to build inside Premiere Pro. | Premiere Pro       |
