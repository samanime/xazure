#! /bin/bash
# This is a helper script when developing multiple xazure packages at the same time.
function install_and_link {
  cd $1;
  npm install;
  npm link;

  if [ $i != xazure-utils ]
  then
    npm link xazure-utils;
  fi

  cd ..;
}

cd ..

declare -a arr=(`ls | grep xazure-`)

install_and_link xazure-utils;

for i in "${arr[@]}"
do
  if [ $i != xazure-demo ] && [ $i != xazure-utils ]
  then
    install_and_link $i;

    if [[ $i != xazure-template* ]]
    then
        toLink="$i $toLink";
    fi
  fi
done

cd xazure-demo;
npm link $toLink;
npm install;