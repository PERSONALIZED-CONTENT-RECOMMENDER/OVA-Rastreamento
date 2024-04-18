#!/bin/bash

subjects=$1
template=$2
path=../Front-End/html/ovas

if [ ! -e ./ova-sql.txt ]
then
	touch ./ova-sql.txt
fi

if [ ! -e ./competency-sql.txt ]
then
	touch ./competency-sql.txt
fi

if [ ! -d $path ]
then
	mkdir $path
else
	rm $path/*.html
fi

#echo "insert into ovas"
#echo "values"

id=0
while read line
do 
	IFS=';' read -r -a array <<< "$line"
	echo "${array[0]}, ${array[1]}, ${array[2]}"
	s=$((++s))
	for i in {1..4}
	do
		arq_name="$(tr ' ' '_' <<< "${line,,}")_$i.html"
	 	arq_name=$(echo $arq_name| iconv -f UTF8 -t ASCII//TRANSLIT)
		arq_path="$path/$arq_name"
		id=$((++id))
		#echo "($id, \"$line\", \"$arq_name\", $id),"

		cp ./$template $arq_path
		sed -i "s/----title----/${line,,}/" $arq_path
		sed -i "s/----subject----/${line}/" $arq_path
		sed -i "s/----competency----/Competência $i/" $arq_path
	done
done < $subjects
