#!/bin/bash

# 현재 디렉토리 및 하위 디렉토리에서 모든 node_modules 폴더 삭제

find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

echo "모든 node_modules 폴더가 삭제되었습니다."
