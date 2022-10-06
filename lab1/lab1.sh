#!/bin/bash

subdir_Name="workspace"
prefix=$1
prefix_length=${#prefix}

touch ./res.txt
echo "$(date)" >> ./res.txt
echo "" >> ./res.txt

renamed_counter=0

for filename in $(ls "./${subdir_Name}/"); do
        if [ "${filename:0:prefix_length+2}" != "${prefix}_a" ] &&
           [ "${filename:0:1}" == "a" ]; then
                before="${subdir_Name}/${filename}" 
                after="${subdir_Name}/${prefix}_${filename}"
                mv $before $after
                echo "${before} renamed to ${after}" >> ./res.txt
                ((renamed_counter++));
        fi
done
echo "successfully renamed ${renamed_counter} files"
