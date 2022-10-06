#!/bin/bash

varName="subdir_Name"
echo "type another subdir_Name"
read newVar
sed -ri "s/^$varName=.+/$varName=\"$newVar\"/" ./lab1.sh
sed -ri "s/^$varName=.+/$varName=\"$newVar\"/" ./gen.sh
