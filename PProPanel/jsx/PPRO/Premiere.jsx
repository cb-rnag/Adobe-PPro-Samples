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

  getSep: function () {
    if (Folder.fs === "Macintosh") {
      return "/";
    } else {
      return "\\";
    }
  },

  exportCurrentFrameAsPNG: function (presetPath) {
    var seq = app.project.activeSequence;
    if (seq) {
      var currentSeqSettings = app.project.activeSequence.getSettings();
      if (currentSeqSettings) {
        var currentTime = seq.getPlayerPosition();
        if (currentTime) {
          var oldInPoint = seq.getInPointAsTime();
          var oldOutPoint = seq.getOutPointAsTime();
          var offsetTime = currentTime.seconds + 0.033; // Todo: Add fancy timecode math, to get one frame, given current sequence timebase

          seq.setInPoint(currentTime.seconds);
          seq.setOutPoint(offsetTime);

          // Create a file name, based on timecode of frame.
          var timeAsText = currentTime.getFormatted(
            currentSeqSettings.videoFrameRate,
            app.project.activeSequence.videoDisplayFormat
          );
          var removeThese = /:|;/gi; // Why? Because Windows chokes on colons in file names.
          var tidyTime = timeAsText.replace(removeThese, "_");
          var outputPathInToOut = new File("~/Desktop/output/in_to_out");
          var outputFileNameInToOut =
            outputPathInToOut.fsName +
            $._PPP_.getSep() +
            seq.name +
            "___" +
            tidyTime +
            "___" +
            ".png";

          var removeUponCompletion = 1;
          var startQueueImmediately = false;
          var jobID_InToOut = app.encoder.encodeSequence(
            seq,
            outputFileNameInToOut,
            presetPath,
            app.encoder.ENCODE_IN_TO_OUT,
            removeUponCompletion,
            startQueueImmediately
          );

          // put in and out points back where we found them.

          seq.setInPoint(oldInPoint.seconds);
          seq.setOutPoint(oldOutPoint.seconds);
        }
      }
    }
  },

  renameProjectItem: function () {
    var item = app.project.rootItem.children[0]; // assumes the zero-th item in the project is footage.
    if (item) {
      item.name = item.name + ", updated by PProPanel.";
    } else {
      $._PPP_.updateEventPanel("No project items found.");
    }
  },

  getActiveSequenceName: function () {
    if (app.project.activeSequence) {
      return app.project.activeSequence.name;
    } else {
      return "No active sequence.";
    }
  },

  projectPanelSelectionChanged: function (eventObj) {
    // Note: This message is also triggered when the user opens or creates a new project.
    var message = "";
    var projectItems = eventObj;
    if (projectItems) {
      if (projectItems.length) {
        var remainingArgs = projectItems.length;
        var view = eventObj.viewID;
        message = remainingArgs + " items selected: ";

        for (var i = 0; i < projectItems.length; i++) {
          // Concatenate selected project item names, into message.
          message += projectItems[i].name;
          remainingArgs--;
          if (remainingArgs > 1) {
            message += ", ";
          }
          if (remainingArgs === 1) {
            message += ", and ";
          }
          if (remainingArgs === 0) {
            message += ".";
          }
        }
      } else {
        message = "No items selected.";
      }
    }
    $._PPP_.updateEventPanel(message);
  },

  registerProjectPanelSelectionChangedFxn: function () {
    app.bind(
      "onSourceClipSelectedInProjectPanel",
      $._PPP_.projectPanelSelectionChanged
    );
  },

  registerItemsAddedToProjectFxn: function () {
    app.bind("onItemsAddedToProjectSuccess", $._PPP_.onItemsAddedToProject);
  },

  searchForBinWithName: function (nameToFind) {
    // deep-search a folder by name in project
    var deepSearchBin = function (inFolder) {
      if (inFolder && inFolder.name === nameToFind && inFolder.type === 2) {
        return inFolder;
      } else {
        for (var i = 0; i < inFolder.children.numItems; i++) {
          if (inFolder.children[i] && inFolder.children[i].type === 2) {
            var foundBin = deepSearchBin(inFolder.children[i]);
            if (foundBin) {
              return foundBin;
            }
          }
        }
      }
    };
    return deepSearchBin(app.project.rootItem);
  },

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

  disableImportWorkspaceWithProjects: function () {
    var prefToModify = "FE.Prefs.ImportWorkspace";
    var propertyExists = app.properties.doesPropertyExist(prefToModify);
    var propertyIsReadOnly = app.properties.isPropertyReadOnly(prefToModify);
    var propertyValue = app.properties.getProperty(prefToModify);

    app.properties.setProperty(prefToModify, "0", 1, false);
    var safetyCheck = app.properties.getProperty(prefToModify);
    if (safetyCheck != propertyValue) {
      $._PPP_.updateEventPanel(
        "Changed 'Import Workspaces with Projects' from " +
          propertyValue +
          " to " +
          safetyCheck +
          "."
      );
    }
  },

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

  transcode: function (outputPresetPath) {
    app.encoder.bind("onEncoderJobComplete", $._PPP_.onEncoderJobComplete);
    app.encoder.bind("onEncoderJobError", $._PPP_.onEncoderJobError);
    app.encoder.bind("onEncoderJobProgress", $._PPP_.onEncoderJobProgress);
    app.encoder.bind("onEncoderJobQueued", $._PPP_.onEncoderJobQueued);
    app.encoder.bind("onEncoderJobCanceled", $._PPP_.onEncoderJobCanceled);

    var projRoot = app.project.rootItem.children;

    if (projRoot.numItems) {
      var firstProjectItem = app.project.rootItem.children[0];
      if (firstProjectItem) {
        app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.

        var fileOutputPath = Folder.selectDialog("Choose the output directory");
        if (fileOutputPath) {
          var regExp = new RegExp("[.]");
          var outputName = firstProjectItem.name.search(regExp);
          if (outputName == -1) {
            outputName = firstProjectItem.name.length;
          }
          var outFileName = firstProjectItem.name.substr(0, outputName);
          outFileName = outFileName.replace("/", "-");
          var completeOutputPath =
            fileOutputPath.fsName + $._PPP_.getSep() + outFileName + ".mxf";
          var removeFromQueue = 1;
          var rangeToEncode = app.encoder.ENCODE_IN_TO_OUT;

          app.encoder.encodeProjectItem(
            firstProjectItem,
            completeOutputPath,
            outputPresetPath,
            rangeToEncode,
            removeFromQueue
          );
          app.encoder.startBatch();
        }
      } else {
        $._PPP_.updateEventPanel("No project items found.");
      }
    } else {
      $._PPP_.updateEventPanel("Project is empty.");
    }
  },

  render: function (outputPresetPath) {
    app.enableQE();
    var activeSequence = qe.project.getActiveSequence(); // we use a QE DOM function, to determine the output extension.
    if (activeSequence) {
      var ameInstalled = false;
      var ameStatus = BridgeTalk.getStatus("ame");
      if (ameStatus == "ISNOTINSTALLED") {
        $._PPP_.updateEventPanel("AME is not installed.");
      } else {
        if (ameStatus == "ISNOTRUNNING") {
          app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.
        }
        var seqInPointAsTime = app.project.activeSequence.getInPointAsTime();
        var seqOutPointAsTime = app.project.activeSequence.getOutPointAsTime();
        var useLast = false;
        var outputPath = app.encoder.lastExportMediaFolder();
        if (outputPath) {
          useLast = confirm(
            "Use most recent output folder",
            false,
            "Use most recent?"
          );
        } else {
          if (useLast === false) {
            var outFolder = Folder.selectDialog("Choose the output directory");
            if (outFolder) {
              outputPath = outFolder.fsName;
            }
          }
        }
        var outPreset = new File(outputPresetPath);
        if (outPreset.exists === true) {
          var outputFormatExtension = activeSequence.getExportFileExtension(
            outPreset.fsName
          );
          if (outputFormatExtension) {
            var outputFilename =
              activeSequence.name + "." + outputFormatExtension;

            var fullPathToFile =
              outputPath + activeSequence.name + "." + outputFormatExtension;

            var outFileTest = new File(fullPathToFile);
            if (outFileTest.exists) {
              var destroyExisting = confirm(
                "A file with that name already exists; overwrite?",
                false,
                "Are you sure...?"
              );
              if (destroyExisting) {
                outFileTest.remove();
                outFileTest.close();
              }
            }

            app.encoder.bind(
              "onEncoderJobComplete",
              $._PPP_.onEncoderJobComplete
            );
            app.encoder.bind("onEncoderJobError", $._PPP_.onEncoderJobError);
            app.encoder.bind(
              "onEncoderJobProgress",
              $._PPP_.onEncoderJobProgress
            );
            app.encoder.bind("onEncoderJobQueued", $._PPP_.onEncoderJobQueued);
            app.encoder.bind(
              "onEncoderJobCanceled",
              $._PPP_.onEncoderJobCanceled
            );

            app.encoder.setSidecarXMPEnabled(0); // use these 0 or 1 settings to disable some/all metadata creation.
            app.encoder.setEmbeddedXMPEnabled(0);

            /*
						For reference, here's how to export from within PPro (blocking further user interaction).

						var seq = app.project.activeSequence;

						if (seq) {
							seq.exportAsMediaDirect(fullPathToFile,
													outPreset.fsName,
													app.encoder.ENCODE_WORKAREA);

							Bonus: Here's how to compute a sequence's duration, in ticks. 254016000000 ticks/second.
							var sequenceDuration = app.project.activeSequence.end - app.project.activeSequence.zeroPoint;
						}
						*/

            var removeFromQueueUponSuccess = 1;
            var jobID = app.encoder.encodeSequence(
              app.project.activeSequence,
              fullPathToFile,
              outPreset.fsName,
              app.encoder.ENCODE_WORKAREA,
              removeFromQueueUponSuccess
            );

            $._PPP_.updateEventPanel("jobID = " + jobID);
            outPreset.close();
          }
        } else {
          $._PPP_.updateEventPanel("Could not find output preset.");
        }
      }
    } else {
      $._PPP_.updateEventPanel("No active sequence.");
    }
  },

  getProductionByName: function (nameToGet) {
    var production;
    var allProductions = app.anywhere.listProductions();
    for (var i = 0; i < allProductions.numProductions; i++) {
      var currentProduction = allProductions[i];
      if (currentProduction.name === nameToGet) {
        production = currentProduction;
      }
    }
    return production;
  },

  // pokeAnywhere: function () {
  //   var token = app.anywhere.getAuthenticationToken();
  //   var productionList = app.anywhere.listProductions();
  //   if (app.anywhere.isProductionOpen()) {
  //     var sessionURL = app.anywhere.getCurrentEditingSessionURL();
  //     var selectionURL = app.anywhere.getCurrentEditingSessionSelectionURL();
  //     var activeSequenceURL =
  //       app.anywhere.getCurrentEditingSessionActiveSequenceURL();
  //     var theOneIAskedFor = $._PPP_.getProductionByName("test");
  //     if (theOneIAskedFor) {
  //       var out = theOneIAskedFor.name + ", " + theOneIAskedFor.description;
  //       $._PPP_.updateEventPanel("Found: " + out); // todo: put useful code here.
  //     }
  //   } else {
  //     $._PPP_.updateEventPanel("No Production open.");
  //   }
  // },

  dumpOMF: function () {
    var activeSequence = app.project.activeSequence;
    if (activeSequence) {
      var outputPath = Folder.selectDialog("Choose the output directory");
      if (outputPath) {
        var absPath = outputPath.fsName;
        var outputName = String(activeSequence.name) + ".omf";
        var fullOutPathWithName = absPath + $._PPP_.getSep() + outputName;

        app.project.exportOMF(
          app.project.activeSequence, // sequence
          fullOutPathWithName, // output file path
          "OMFTitle", // OMF title
          48000, // sample rate (48000 or 96000)
          16, // bits per sample (16 or 24)
          1, // audio encapsulated flag (1:yes or 0:no)
          0, // audio file format (0:AIFF or 1:WAV)
          0, // trim audio files (0:no or 1:yes)
          0, // handle frames (if trim is 1, handle frames from 0 to 1000)
          0
        ); // include pan flag (0:no or 1:yes)
      }
    } else {
      $._PPP_.updateEventPanel("No active sequence.");
    }
  },

  updateEventPanel: function (message) {
    app.setSDKEventMessage(message, "info");
    /*app.setSDKEventMessage('Here is some information.', 'info');
		app.setSDKEventMessage('Here is a warning.', 'warning');
		app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use sparingly.*/
  },

  walkAllBinsDumpingXMP: function (parentItem, outPath) {
    for (var j = 0; j < parentItem.children.numItems; j++) {
      var currentChild = parentItem.children[j];
      if (currentChild) {
        if (currentChild.type === ProjectItemType.BIN) {
          $._PPP_.walkAllBinsDumpingXMP(currentChild, outPath); // warning; recursion!
        } else {
          var isMultiCam = currentChild.isMulticamClip();
          var isMergedClip = currentChild.isMergedClip();
          if (isMergedClip === false && isMultiCam === false) {
            $._PPP_.dumpProjectItemXMP(currentChild, outPath);
          }
        }
      }
    }
  },

  walkAllBinsUpdatingPaths: function (parentItem, outPath) {
    for (var j = 0; j < parentItem.children.numItems; j++) {
      var currentChild = parentItem.children[j];
      if (currentChild) {
        if (currentChild.type === ProjectItemType.BIN) {
          $._PPP_.walkAllBinsUpdatingPaths(currentChild, outPath); // warning; recursion!
        } else {
          $._PPP_.updateProjectItemPath(currentChild, outPath);
        }
      }
    }
  },

  searchBinForProjItemByName: function (i, containingBin, nameToFind) {
    for (var j = i; j < containingBin.children.numItems; j++) {
      var currentChild = containingBin.children[j];
      if (currentChild) {
        if (currentChild.type === ProjectItemType.BIN) {
          return $._PPP_.searchBinForProjItemByName(
            j,
            currentChild,
            nameToFind
          ); // warning; recursion!
        } else {
          if (currentChild.name === nameToFind) {
            return currentChild;
          } else {
            currentChild = currentChild.children[j + 1];
            if (currentChild) {
              return $._PPP_.searchBinForProjItemByName(
                0,
                currentChild,
                nameToFind
              );
            }
          }
        }
      }
    }
  },

  dumpProjectItemXMP: function (projectItem, outPath) {
    var xmpBlob = projectItem.getXMPMetadata();
    var outFileName = projectItem.name + ".xmp";
    var completeOutputPath = outPath + $._PPP_.getSep() + outFileName;
    var outFile = new File(completeOutputPath);

    if (outFile) {
      outFile.encoding = "UTF8";
      outFile.open("w", "TEXT", "????");
      outFile.write(xmpBlob.toString());
      outFile.close();
    }
  },

  //   getProjectProxySetting: function () {
  //     var returnVal = "";
  //     if (app.project) {
  //       returnVal = "No sequence detected in " + app.project.name + ".";
  //       if (app.getEnableProxies()) {
  //         returnVal = "true";
  //       } else {
  //         returnVal = "false";
  //       }
  //     } else {
  //       returnVal = "No project available.";
  //     }
  //     return returnVal;
  //   },

  toggleProxyState: function () {
    var update = "Proxies for " + app.project.name + " turned ";
    if (app.getEnableProxies()) {
      app.setEnableProxies(0);
      update = update + "OFF.";
    } else {
      app.setEnableProxies(1);
      update = update + "ON.";
    }
    $._PPP_.updateEventPanel(update);
  },

  // Define a couple of callback functions, for AME to use during render.

  onEncoderJobComplete: function (jobID, outputFilePath) {
    $._PPP_.updateEventPanel(
      "onEncoderJobComplete called. jobID = " + jobID + "."
    );
  },

  onEncoderJobError: function (jobID, errorMessage) {
    var eoName = "";
    if (Folder.fs === "Macintosh") {
      eoName = "PlugPlugExternalObject";
    } else {
      eoName = "PlugPlugExternalObject.dll";
    }
    var plugplugLibrary = new ExternalObject("lib:" + eoName);
    if (plugplugLibrary) {
      var eventObj = new CSXSEvent();
      eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
      eventObj.data = "Job " + jobID + " failed, due to " + errorMessage + ".";
      eventObj.dispatch();
    }
  },

  onEncoderJobProgress: function (jobID, progress) {
    $._PPP_.updateEventPanel(
      "onEncoderJobProgress called. jobID = " +
        jobID +
        ". progress = " +
        progress +
        "."
    );
  },

  onEncoderJobQueued: function (jobID) {
    var eoName = "";
    if (Folder.fs === "Macintosh") {
      eoName = "PlugPlugExternalObject";
    } else {
      eoName = "PlugPlugExternalObject.dll";
    }
    var plugplugLibrary = new ExternalObject("lib:" + eoName);
    if (plugplugLibrary) {
      var eventObj = new CSXSEvent();
      eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
      eventObj.data = "Job " + jobID + " queued.";
      eventObj.dispatch();
      $._PPP_.updateEventPanel("jobID " + jobID + "successfully queued.");
      app.encoder.startBatch();
    }
  },

  onEncoderJobCanceled: function (jobID) {
    var eoName = "";
    if (Folder.fs === "Macintosh") {
      eoName = "PlugPlugExternalObject";
    } else {
      eoName = "PlugPlugExternalObject.dll";
    }
    var plugplugLibrary = new ExternalObject("lib:" + eoName);
    if (plugplugLibrary) {
      var eventObj = new CSXSEvent();
      eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
      eventObj.data = "Job " + jobID + " canceled.";
      eventObj.dispatch();
      $._PPP_.updateEventPanel(
        "OnEncoderJobCanceled called. jobID = " + jobID + "."
      );
    }
  },

  extractFileNameFromPath: function (fullPath) {
    var lastDot = fullPath.lastIndexOf(".");
    var lastSep = fullPath.lastIndexOf("/");
    if (lastDot > -1) {
      return fullPath.substr(lastSep + 1, fullPath.length - (lastDot + 1));
    } else {
      return fullPath;
    }
  },

  onProxyTranscodeJobComplete: function (jobID, outputFilePath) {
    var suffixAddedByPPro = "_1"; // You should really test for any suffix.
    var withoutExtension = outputFilePath.slice(0, -4); // trusting 3 char extension
    var lastIndex = outputFilePath.lastIndexOf(".");
    var extension = outputFilePath.substr(lastIndex + 1);
    var wrapper = [];
    wrapper[0] = outputFilePath;
    var nameToFind = "Proxies generated by PProPanel";
    var targetBin = $._PPP_.getPPPInsertionBin();
    if (targetBin) {
      app.project.importFiles(wrapper, true, null, false);
    }
  },

  onProxyTranscodeJobError: function (jobID, errorMessage) {
    $._PPP_.updateEventPanel(errorMessage);
  },

  onProxyTranscodeJobQueued: function (jobID) {
    app.encoder.startBatch();
  },

  // closeFrontSourceClip: function () {
  //   app.sourceMonitor.closeClip();
  // },
  //
  // closeAllClipsInSourceMonitor: function () {
  //   app.sourceMonitor.closeAllClips();
  // },

  getPPPInsertionBin: function () {
    var nameToFind = "Here's where PProPanel puts things.";
    var targetBin = $._PPP_.searchForBinWithName(nameToFind);

    if (targetBin === undefined) {
      // If panel can't find the target bin, it creates it.
      app.project.rootItem.createBin(nameToFind);
      targetBin = $._PPP_.searchForBinWithName(nameToFind);
    }
    if (targetBin) {
      targetBin.select();
      return targetBin;
    } else {
      $._PPP_.updateEventPanel("Couldn't find or create a target bin.");
    }
  },

  setAllProjectItemsOnline: function (startingBin) {
    for (var k = 0; k < startingBin.children.numItems; k++) {
      var currentChild = startingBin.children[k];
      if (currentChild) {
        if (currentChild.type === ProjectItemType.BIN) {
          $._PPP_.setAllProjectItemsOnline(currentChild); // warning; recursion!
        } else if (currentChild.isOffline()) {
          currentChild.changeMediaPath(currentChild.getMediaPath(), true);
          if (currentChild.isOffline()) {
            $._PPP_.updateEventPanel(
              "Failed to bring '" + currentChild.name + "' online."
            );
          } else {
            $._PPP_.updateEventPanel(
              "'" + currentChild.name + "' is once again online."
            );
          }
        }
      }
    }
  },

  onItemAddedToProject: function (whichProject, addedProjectItem) {
    var msg = addedProjectItem.name + " was added to " + whichProject + ".";
    $._PPP_.updateEventPanel(msg);
  },

  registerItemAddedFxn: function () {
    app.onItemAddedToProjectSuccess = $._PPP_.onItemAddedToProject;
  },

  myOnProjectChanged: function (documentID) {
    var msg = "Project with ID " + documentID + " changed, in some way.";
    $._PPP_.updateEventPanel(msg);
  },

  registerProjectChangedFxn: function () {
    app.bind("onProjectChanged", $._PPP_.myOnProjectChanged);
  },

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

  myActiveSequenceChangedFxn: function () {
    $._PPP_.updateEventPanel(
      app.project.activeSequence.name + " changed, in some way."
    );
  },

  mySequenceActivatedFxn: function () {
    $._PPP_.updateEventPanel(
      "Active sequence is now " +
        app.project.activeSequence.name +
        ", in Project " +
        app.project.name +
        "."
    );
  },

  myActiveSequenceSelectionChangedFxn: function () {
    var seq = app.project.activeSequence;
    if (seq) {
      var sel = seq.getSelection();
      if (sel) {
        $._PPP_.updateEventPanel(
          sel.length +
            " track items selected in " +
            app.project.activeSequence.name +
            "."
        );
        for (var i = 0; i < sel.length; i++) {
          if (sel[i].name !== "anonymous") {
            $._PPP_.updateEventPanel(
              "Selected item " + (i + 1) + " == " + sel[i].name + "."
            );
          }
        }
      } else {
        $._PPP_.updateEventPanel("No clips selected.");
      }
    } else {
      $._PPP_.updateEventPanel("No active sequence.");
    }
  },

  myActiveSequenceStructureChangedFxn: function () {
    $._PPP_.updateEventPanel(
      "Something in  " + app.project.activeSequence.name + "changed."
    );
  },

  registerActiveSequenceStructureChangedFxn: function () {
    var success = app.bind(
      "onActiveSequenceStructureChanged",
      $._PPP_.myActiveSequenceStructureChangedFxn
    );
  },

  registerActiveSequenceChangedFxn: function () {
    var success = app.bind(
      "onActiveSequenceChanged",
      $._PPP_.myActiveSequenceChangedFxn
    );
  },

  registerSequenceSelectionChangedFxn: function () {
    var success = app.bind(
      "onActiveSequenceSelectionChanged",
      $._PPP_.myActiveSequenceSelectionChangedFxn
    );
  },

  registerSequenceActivatedFxn: function () {
    var success = app.bind(
      "onSequenceActivated",
      $._PPP_.mySequenceActivatedFxn
    );
  },

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

  countAdjustmentLayersInBin: function (
    parentItem,
    arrayOfAdjustmentLayerNames,
    foundSoFar
  ) {
    for (var j = 0; j < parentItem.children.numItems; j++) {
      var currentChild = parentItem.children[j];
      if (currentChild) {
        if (currentChild.type == ProjectItemType.BIN) {
          $._PPP_.countAdjustmentLayersInBin(
            currentChild,
            arrayOfAdjustmentLayerNames,
            foundSoFar
          ); // warning; recursion!
        } else {
          if (currentChild.isAdjustmentLayer()) {
            arrayOfAdjustmentLayerNames[foundSoFar] = currentChild.name;
            foundSoFar++;
          }
        }
      }
    }
    $._PPP_.updateEventPanel(
      foundSoFar + " adjustment layers found in " + app.project.name + "."
    );
  },

  closeLog: function () {
    app.enableQE();
    qe.executeConsoleCommand("con.closelog");
  },

  stitch: function (presetPath) {
    var viewIDs = app.getProjectViewIDs();
    var allPathsToStitch = "";

    for (var a = 0; a < app.projects.numProjects; a++) {
      var currentProject = app.getProjectFromViewID(viewIDs[a]);
      if (currentProject) {
        if (currentProject.documentID === app.project.documentID) {
          // We're in the right project!
          var selectedItems = app.getProjectViewSelection(viewIDs[a]);
          if (selectedItems.length > 1) {
            for (var b = 0; b < selectedItems.length; b++) {
              var currentItem = selectedItems[b];
              if (currentItem) {
                if (
                  !currentItem.isSequence() &&
                  currentItem.type !== ProjectItemType.BIN
                ) {
                  // For every selected item which isn't a bin or sequence...
                  allPathsToStitch += currentItem.getMediaPath();
                  allPathsToStitch += ";";
                }
              }
            }
            var AMEString =
              'var fe = app.getFrontend(); fe.stitchFiles("' +
              allPathsToStitch +
              '"';
            var addendum =
              ', "H.264", "' +
              presetPath +
              '", ' +
              '"(This path parameter is never used)");';

            AMEString += addendum;
            var bt = new BridgeTalk();
            bt.target = "ame";
            bt.body = AMEString;
            bt.send();
          } else {
            $._PPP_.updateEventPanel(
              "Select more than one render-able item, then try stitching again."
            );
          }
        }
      }
    }
  },

  myTrackItemAdded: function (track, trackItem) {
    $._PPP_.updateEventPanel(
      "onActiveSequenceTrackItemAdded: " +
        track.name +
        " : " +
        trackItem.name +
        " : " +
        trackItem.nodeId +
        "."
    );
  },

  myTrackItemRemoved: function (track, trackItem) {
    $._PPP_.updateEventPanel(
      "onActiveSequenceTrackItemRemoved: " +
        track.name +
        " : " +
        trackItem.name +
        " : " +
        trackItem.nodeId +
        "."
    );
  },

  mySequenceStructureChanged: function () {
    $._PPP_.updateEventPanel("onActiveSequenceStructureChanged.");
  },

  registerSequenceMessaging: function () {
    app.bind("onActiveSequenceTrackItemRemoved", $._PPP_.myTrackItemRemoved);
    app.bind("onActiveSequenceTrackItemAdded", $._PPP_.myTrackItemAdded);
    app.bind(
      "onActiveSequenceStructureChanged",
      $._PPP_.mySequenceStructureChanged
    );
  },

  // enumerateTeamProjects: function () {
  //   var numTeamProjectsOpen = 0;
  //   for (var i = 0; i < app.projects.numProjects; i++) {
  //     var project = app.projects[i];
  //     if (project.isCloudProject) {
  //       numTeamProjectsOpen++;
  //       $._PPP_.updateEventPanel(project.name + " is a cloud-based project.");
  //       var localHubID = project.cloudProjectLocalID;
  //       $._PPP_.updateEventPanel("LocalHub Id is " + localHubID + ".");
  //       var production = qe.ea.getProductionByID(localHubID);
  //       $._PPP_.updateEventPanel("Production Name is " + production.name + ".");
  //       var remoteID = production.getRemoteProductionID();
  //       $._PPP_.updateEventPanel("Remote Production Id is " + remoteID + ".");
  //     }
  //   }
  //   if (numTeamProjectsOpen === 0) {
  //     $._PPP_.updateEventPanel("No open Team Projects found.");
  //   } else {
  //     $._PPP_.updateEventPanel(
  //       numTeamProjectsOpen + " open Team Projects Team Projects found."
  //     );
  //   }
  // },

  enableWorkArea: function (enable) {
    var seq = app.project.activeSequence;
    if (seq) {
      var newStateString = "undefined";
      seq.setWorkAreaEnabled(enable);
      var newState = seq.isWorkAreaEnabled();
      if (newState) {
        newStateString = "ON";
      } else {
        newStateString = "OFF";
      }
      var update =
        "Work area for " +
        app.project.activeSequence.name +
        " is now " +
        newStateString +
        ".";
      $._PPP_.updateEventPanel(update);
    } else {
      $._PPP_.updateEventPanel("No active sequence.");
    }
  },

  modifyWorkArea: function () {
    var seq = app.project.activeSequence;
    if (seq) {
      var workAreaIsEnabled = seq.isWorkAreaEnabled();
      if (!workAreaIsEnabled) {
        var confirmString = "Enable work area for " + seq.name + "?";
        var turnOn = confirm(confirmString, true, "Are you sure...?");
        if (turnOn) {
          $._PPP_.enableWorkArea(true);
        }
      }
      var oldIn = seq.getWorkAreaInPointAsTime();
      var oldOut = seq.getWorkAreaOutPointAsTime();
      var newIn = oldIn;
      var newOut = oldOut;
      var duration = oldOut.seconds - oldIn.seconds;
      newIn.seconds = oldIn.seconds + 10;
      newOut.seconds = oldOut.seconds - 10;

      seq.setWorkAreaInPoint(newIn.seconds);
      seq.setWorkAreaOutPoint(newOut.seconds);
    }
  },

  setLocale: function (localeFromCEP) {
    $.locale = localeFromCEP;
    // $._PPP_.updateEventPanel(
    //   "ExtendScript Locale set to " + localeFromCEP + "."
    // );
  },

  disableTranscodeOnIngest: function (newValue) {
    return app.setEnableTranscodeOnIngest(newValue);
  },

  checkMacFileType: function (file) {
    if (!file instanceof Folder) {
      return true;
    }

    var index = file.name.lastIndexOf(".");
    var ext = file.name.substring(index + 1);

    if (ext == "xml" || ext == "XML") {
      return true;
    } else {
      return false;
    }
  },
};
