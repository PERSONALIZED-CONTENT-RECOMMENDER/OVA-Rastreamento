#!/bin/bash

subjects=$1
template=$2
path=../Front-End/html/ovas

if [ ! -e ./ova-sql.txt ]
then
    touch ./ova-sql.txt
fi

echo "insert into ovas" > ./ova-sql.txt
echo "values" >> ./ova-sql.txt

if [ ! -e ./competency-sql.txt ]
then
    touch ./competency-sql.txt
fi	

echo "insert into competencies" > ./competency-sql.txt
echo "values" >> ./competency-sql.txt

if [ ! -d $path ]
then
    mkdir $path
else
    rm $path/*.html
fi

competency_id=0
ova_id=0
competency_count=0
subject_num_competencies=0
subject_id=0
subject_name=""
while read line
do
    IFS=';' read -r -a array <<< "$line"
	if [ $competency_count = 0 ]
	then
        competency_count=${array[2]}
		subject_num_competencies=${array[2]}
       	subject_id=${array[0]}
		subject_name=${array[1]}
        else
		competency_count=$((--competency_count))
		competency_id=$((++competency_id))
		echo "($competency_id, \"${array[0]}\", $subject_id)," >> ./competency-sql.txt
		for (( i=1; i <= ${array[1]}; i++ ))
		do
			ova_name="$subject_name - Competência $(($subject_num_competencies - $competency_count)) - $i"
			arq_name="$(tr ' ' '_' <<< "${subject_name,,}")_$(($subject_num_competencies - $competency_count))_$i.html"
		    arq_name=$(echo $arq_name | iconv -f UTF8 -t ASCII//TRANSLIT)
			echo "($((++ova_id)), \"$ova_name\", \"$arq_name\", 30, $competency_id)," >> ./ova-sql.txt

			arq_path="$path/$arq_name"
            cp ./$template $arq_path
            sed -i "s/----title----/${line,,}/" $arq_path
            sed -i "s/----subject----/${line}/" $arq_path
            sed -i "s/----competency----/Competência $i/" $arq_path
		done
	fi
done < $subjects 
