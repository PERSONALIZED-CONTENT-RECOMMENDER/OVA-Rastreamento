#!/bin/bash

template=$3
path="/home/eduardo/Documentos/ICv-Sanval/OVA-Rastreamento/Front-End/html/ovas"

if [ ! -d $path ]
then
	mkdir $path
else
	rm $path/*
fi

while read line
do 
	for i in {1..4}
	do
		arq_path="$path/$(tr ' ' '_' <<< "$line")_$i.html"
		cp ./$template $arq_path
		sed -i "s/----title----/${line,,}/" $arq_path
		sed -i "s/----subject----/${line}/" $arq_path
		sed -i "s/----competency----/Competência $i/" $arq_path
	done
done < $1
