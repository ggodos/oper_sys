#!/bin/bash

subdir_Name="workspace"
prefix_name=$1

rm $subdir_Name -rf && mkdir $subdir_Name

for i in {1..3}; do
        # with 'a'
        touch "${subdir_Name}/another_$i"
        # without 'a'
        touch "${subdir_Name}/main_$i"
        # with 'a' and prefix
        touch "${subdir_Name}/${prefix_name}_aready_$i"
done
        
