/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2020 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 **************************************************************************/

// time display types

var TIMEDISPLAY_24Timecode = 100;
var TIMEDISPLAY_25Timecode = 101;
var TIMEDISPLAY_2997DropTimecode = 102;
var TIMEDISPLAY_2997NonDropTimecode = 103;
var TIMEDISPLAY_30Timecode = 104;
var TIMEDISPLAY_50Timecode = 105;
var TIMEDISPLAY_5994DropTimecode = 106;
var TIMEDISPLAY_5994NonDropTimecode = 107;
var TIMEDISPLAY_60Timecode = 108;
var TIMEDISPLAY_Frames = 109;
var TIMEDISPLAY_23976Timecode = 110;
var TIMEDISPLAY_16mmFeetFrames = 111;
var TIMEDISPLAY_35mmFeetFrames = 112;
var TIMEDISPLAY_48Timecode = 113;
var TIMEDISPLAY_AudioSamplesTimecode = 200;
var TIMEDISPLAY_AudioMsTimecode = 201;

var KF_Interp_Mode_Linear = 0;
var KF_Interp_Mode_Hold = 4;
var KF_Interp_Mode_Bezier = 5;
var KF_Interp_Mode_Time = 6;

// field type constants

var FIELDTYPE_Progressive = 0;
var FIELDTYPE_UpperFirst = 1;
var FIELDTYPE_LowerFirst = 2;

// audio channel types

var AUDIOCHANNELTYPE_Mono = 0;
var AUDIOCHANNELTYPE_Stereo = 1;
var AUDIOCHANNELTYPE_51 = 2;
var AUDIOCHANNELTYPE_Multichannel = 3;
var AUDIOCHANNELTYPE_4Channel = 4;
var AUDIOCHANNELTYPE_8Channel = 5;

// vr projection type

var VRPROJECTIONTYPE_None = 0;
var VRPROJECTIONTYPE_Equirectangular = 1;

// vr stereoscopic type

var VRSTEREOSCOPICTYPE_Monoscopic = 0;
var VRSTEREOSCOPICTYPE_OverUnder = 1;
var VRSTEREOSCOPICTYPE_SideBySide = 2;

// constants used when clearing cache

var MediaType_VIDEO = "228CDA18-3625-4d2d-951E-348879E4ED93"; // Magical constants from Premiere Pro's internal automation.
var MediaType_AUDIO = "80B8E3D5-6DCA-4195-AEFB-CB5F407AB009";
var MediaType_ANY = "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";

var MediaType_Audio = 0; // Constants for working with setting value.
var MediaType_Video = 1;

var Colorspace_601 = 0;
var Colorspace_709 = 1;
var Colorspace_2020 = 2;
var Colorspace_2100HLG = 3;

var BitPrecision_8bit = 0;
var BitPrecision_10bit = 1;
var BitPrecision_Float = 2;
var BitPrecision_HDR = 3;

var NOT_SET = "-400000";

$._PPP_ = {
  getVersionInfo: function () {
    return "PPro " + app.version + "x" + app.build;
  },

  getUserName: function () {
    var userName = "User name not found.";
    var homeDir = new File("~/");
    if (homeDir) {
      userName = homeDir.displayName;
      homeDir.close();
    }
    return userName;
  },

  keepPanelLoaded: function () {
    app.setExtensionPersistent(
      "org.collegeboard.ritviknag.zoom-chat-to-markers",
      0
    ); // 0, while testing (to enable rapid reload); 1 for "Never unload me, even when not visible."
  },

  // getSep: function () {
  //   if (Folder.fs === "Macintosh") {
  //     return "/";
  //   } else {
  //     return "\\";
  //   }
  // },

  // getActiveSequenceName: function () {
  //   if (app.project.activeSequence) {
  //     return app.project.activeSequence.name;
  //   } else {
  //     return "No active sequence.";
  //   }
  // },

  // registerItemsAddedToProjectFxn: function () {
  //   app.bind("onItemsAddedToProjectSuccess", $._PPP_.onItemsAddedToProject);
  // },

  // importFiles: function () {
  //   var filterString = "";
  //   if (Folder.fs === "Windows") {
  //     filterString = "All files:*.*";
  //   }
  //   if (app.project) {
  //     var fileOrFilesToImport = File.openDialog(
  //       "Choose files to import", // title
  //       filterString, // filter available files?
  //       true
  //     ); // allow multiple?
  //     if (fileOrFilesToImport) {
  //       // We have an array of File objects; importFiles() takes an array of paths.
  //       var importThese = [];
  //       if (importThese) {
  //         for (var i = 0; i < fileOrFilesToImport.length; i++) {
  //           importThese[i] = fileOrFilesToImport[i].fsName;
  //         }
  //         var suppressWarnings = true;
  //         var importAsStills = false;
  //         app.project.importFiles(
  //           importThese,
  //           suppressWarnings,
  //           app.project.getInsertionBin(),
  //           importAsStills
  //         );
  //       }
  //     } else {
  //       $._PPP_.updateEventPanel("No files to import.");
  //     }
  //   }
  // },

  // turnOffStartDialog: function () {
  //   var prefToModify = "MZ.Prefs.ShowQuickstartDialog";
  //   var propertyExists = app.properties.doesPropertyExist(prefToModify);
  //   var propertyIsReadOnly = app.properties.isPropertyReadOnly(prefToModify);
  //   var originalValue = app.properties.getProperty(prefToModify);

  //   app.properties.setProperty(prefToModify, "0", 1, true); // optional 4th param:0 = non-persistent,  1 = persistent (default)
  //   var safetyCheck = app.properties.getProperty(prefToModify);
  //   if (safetyCheck != originalValue) {
  //     $._PPP_.updateEventPanel("Start dialog now OFF. Enjoy!");
  //   } else {
  //     $._PPP_.updateEventPanel("Start dialog was already OFF.");
  //   }
  // },

  // transcode: function (outputPresetPath) {
  //   app.encoder.bind("onEncoderJobComplete", $._PPP_.onEncoderJobComplete);
  //   app.encoder.bind("onEncoderJobError", $._PPP_.onEncoderJobError);
  //   app.encoder.bind("onEncoderJobProgress", $._PPP_.onEncoderJobProgress);
  //   app.encoder.bind("onEncoderJobQueued", $._PPP_.onEncoderJobQueued);
  //   app.encoder.bind("onEncoderJobCanceled", $._PPP_.onEncoderJobCanceled);

  //   var projRoot = app.project.rootItem.children;

  //   if (projRoot.numItems) {
  //     var firstProjectItem = app.project.rootItem.children[0];
  //     if (firstProjectItem) {
  //       app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.

  //       var fileOutputPath = Folder.selectDialog("Choose the output directory");
  //       if (fileOutputPath) {
  //         var regExp = new RegExp("[.]");
  //         var outputName = firstProjectItem.name.search(regExp);
  //         if (outputName == -1) {
  //           outputName = firstProjectItem.name.length;
  //         }
  //         var outFileName = firstProjectItem.name.substr(0, outputName);
  //         outFileName = outFileName.replace("/", "-");
  //         var completeOutputPath =
  //           fileOutputPath.fsName + $._PPP_.getSep() + outFileName + ".mxf";
  //         var removeFromQueue = 1;
  //         var rangeToEncode = app.encoder.ENCODE_IN_TO_OUT;

  //         app.encoder.encodeProjectItem(
  //           firstProjectItem,
  //           completeOutputPath,
  //           outputPresetPath,
  //           rangeToEncode,
  //           removeFromQueue
  //         );
  //         app.encoder.startBatch();
  //       }
  //     } else {
  //       $._PPP_.updateEventPanel("No project items found.");
  //     }
  //   } else {
  //     $._PPP_.updateEventPanel("Project is empty.");
  //   }
  // },

  updateEventPanel: function (message) {
    app.setSDKEventMessage(message, "info");
    /*app.setSDKEventMessage('Here is some information.', 'info');
		app.setSDKEventMessage('Here is a warning.', 'warning');
		app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use sparingly.*/
  },

  // Define a couple of callback functions, for AME to use during render.

  // onEncoderJobComplete: function (jobID, outputFilePath) {
  //   $._PPP_.updateEventPanel(
  //     "onEncoderJobComplete called. jobID = " + jobID + "."
  //   );
  // },

  // onEncoderJobError: function (jobID, errorMessage) {
  //   var eoName = "";
  //   if (Folder.fs === "Macintosh") {
  //     eoName = "PlugPlugExternalObject";
  //   } else {
  //     eoName = "PlugPlugExternalObject.dll";
  //   }
  //   var plugplugLibrary = new ExternalObject("lib:" + eoName);
  //   if (plugplugLibrary) {
  //     var eventObj = new CSXSEvent();
  //     eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
  //     eventObj.data = "Job " + jobID + " failed, due to " + errorMessage + ".";
  //     eventObj.dispatch();
  //   }
  // },

  // onEncoderJobProgress: function (jobID, progress) {
  //   $._PPP_.updateEventPanel(
  //     "onEncoderJobProgress called. jobID = " +
  //       jobID +
  //       ". progress = " +
  //       progress +
  //       "."
  //   );
  // },

  // onEncoderJobQueued: function (jobID) {
  //   var eoName = "";
  //   if (Folder.fs === "Macintosh") {
  //     eoName = "PlugPlugExternalObject";
  //   } else {
  //     eoName = "PlugPlugExternalObject.dll";
  //   }
  //   var plugplugLibrary = new ExternalObject("lib:" + eoName);
  //   if (plugplugLibrary) {
  //     var eventObj = new CSXSEvent();
  //     eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
  //     eventObj.data = "Job " + jobID + " queued.";
  //     eventObj.dispatch();
  //     $._PPP_.updateEventPanel("jobID " + jobID + "successfully queued.");
  //     app.encoder.startBatch();
  //   }
  // },

  // onEncoderJobCanceled: function (jobID) {
  //   var eoName = "";
  //   if (Folder.fs === "Macintosh") {
  //     eoName = "PlugPlugExternalObject";
  //   } else {
  //     eoName = "PlugPlugExternalObject.dll";
  //   }
  //   var plugplugLibrary = new ExternalObject("lib:" + eoName);
  //   if (plugplugLibrary) {
  //     var eventObj = new CSXSEvent();
  //     eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
  //     eventObj.data = "Job " + jobID + " canceled.";
  //     eventObj.dispatch();
  //     $._PPP_.updateEventPanel(
  //       "OnEncoderJobCanceled called. jobID = " + jobID + "."
  //     );
  //   }
  // },

  // extractFileNameFromPath: function (fullPath) {
  //   var lastDot = fullPath.lastIndexOf(".");
  //   var lastSep = fullPath.lastIndexOf("/");
  //   if (lastDot > -1) {
  //     return fullPath.substr(lastSep + 1, fullPath.length - (lastDot + 1));
  //   } else {
  //     return fullPath;
  //   }
  // },

  // onItemAddedToProject: function (whichProject, addedProjectItem) {
  //   var msg = addedProjectItem.name + " was added to " + whichProject + ".";
  //   $._PPP_.updateEventPanel(msg);
  // },

  // registerItemAddedFxn: function () {
  //   app.onItemAddedToProjectSuccess = $._PPP_.onItemAddedToProject;
  // },

  confirmPProHostVersion: function () {
    var version = parseFloat(app.version);
    if (version < 14.0) {
      $._PPP_.updateEventPanel(
        "Note: PProPanel relies on features added in 14.0, but is currently running in " +
          version +
          "."
      );
    }
  },

  // myActiveSequenceChangedFxn: function () {
  //   $._PPP_.updateEventPanel(
  //     app.project.activeSequence.name + " changed, in some way."
  //   );
  // },

  // mySequenceActivatedFxn: function () {
  //   $._PPP_.updateEventPanel(
  //     "Active sequence is now " +
  //       app.project.activeSequence.name +
  //       ", in Project " +
  //       app.project.name +
  //       "."
  //   );
  // },

  // registerActiveSequenceChangedFxn: function () {
  //   var success = app.bind(
  //     "onActiveSequenceChanged",
  //     $._PPP_.myActiveSequenceChangedFxn
  //   );
  // },

  // registerSequenceActivatedFxn: function () {
  //   var success = app.bind(
  //     "onSequenceActivated",
  //     $._PPP_.mySequenceActivatedFxn
  //   );
  // },

  forceLogfilesOn: function () {
    app.enableQE();
    var previousLogFilesValue = qe.getDebugDatabaseEntry(
      "CreateLogFilesThatDoNotExist"
    );

    if (previousLogFilesValue === "true") {
      // $._PPP_.updateEventPanel("Force create Log files was already ON.");
    } else {
      qe.setDebugDatabaseEntry("CreateLogFilesThatDoNotExist", "true");
      $._PPP_.updateEventPanel("Set Force create Log files to ON.");
    }
  },

  closeLog: function () {
    app.enableQE();
    qe.executeConsoleCommand("con.closelog");
  },

  setLocale: function (localeFromCEP) {
    $.locale = localeFromCEP;
    // $._PPP_.updateEventPanel(
    //   "ExtendScript Locale set to " + localeFromCEP + "."
    // );
  },
};
