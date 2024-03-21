
CERT_PASS=$(<.password)

if [ -z CERT_PASS ]; then
    echo "Please put the Certificate Password in a \`.password\` file"
    exit 1
fi

rm -f ZoomChatToMarkers.zxp

ZXPSignCmd \
-sign \
ZoomChatToMarkers \
ZoomChatToMarkers.zxp \
MyCert.p12 \
"$CERT_PASS" \
-tsa http://timestamp.digicert.com/
