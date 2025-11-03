#!/bin/bash

set -e

ZIPFILE="$1"
OUTFILE="$2"
FRAMERATE="${3:-30}"

if [ -z "$ZIPFILE" ] || [ -z "$OUTFILE" ]; then
  echo "Usage: $0 frames.zip output.webm [framerate]"
  exit 1
fi

WORKDIR=$(mktemp -d)
trap "rm -rf $WORKDIR" EXIT

# Unpack the zip archive
unzip "$ZIPFILE" -d "$WORKDIR"

ffmpeg -y -framerate "$FRAMERATE" -i $WORKDIR/frame_%04d.png -c:v libvpx-vp9 -pix_fmt yuv420p10le -b:v 8M "$OUTFILE"

echo "Video saved to $OUTFILE"
