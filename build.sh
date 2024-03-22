
CERT_PASS=$(<.password)

if [ -z CERT_PASS ]; then
    touch .password
    echo "Please put the Certificate Password in a \`.password\` file"
    exit 1
fi

rm -f ZoomChatToMarkers.zxp

# Download `ZXPSignCmd` if needed
if ! command -v ZXPSignCmd &> /dev/null; then
    echo "Downloading ZXPSignCmd ..."
    f="/tmp/ZXPSignCmd.dmg"
    curl -fsSL https://github.com/Adobe-CEP/CEP-Resources/raw/master/ZXPSignCMD/4.1.2/macOS/ZXPSignCmd-64bit.dmg -o "$f"
    VOLUME=$(hdiutil attach "$f" | tail -1 | awk '{print $3}')
    sudo cp -r "$VOLUME/"ZXPSignCmd-64bit /usr/local/bin/ZXPSignCmd
    diskutil quiet unmount "$VOLUME"
    rm -f "$f"
    echo "Done!"
    echo
fi

ZXPSignCmd \
-sign \
ZoomChatToMarkers \
ZoomChatToMarkers.zxp \
MyCert.p12 \
"$CERT_PASS" \
-tsa http://timestamp.digicert.com/
