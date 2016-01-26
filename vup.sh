#!/bin/bash
# This script bumps the version number of a Go project. The variable "Version"
# should be declared as a constant in the file that matches the name of the
# project. For example, a project contained in example/ should declare Version
# in example.go.
#
# To use: vup <level>
#
# <level> is the depth of the bump, determined by number of periods
# to the left of the number. For example, bumping v1 to v2 is a level
# 0 bump. Bumping v1.1 to v1.2 is a level 1 bump. By default, no more
# than two levels are allowed, just due to versioning clutter.
#
# If --tag is specified, then vup will create a new git commit with a
# default message. To override the default message, add --edit. If
# <level> is 0, then vup will also use GPG to sign the tag.

# DEFAULTS
SIGNBASE=TRUE
MAXLEVEL=2
FILE=$(basename $(pwd)).js

# SCRIPT
LEVEL=$1

if [[ -z $LEVEL ]]
then
	echo No depth given.
	exit 1
fi

if [[ $LEVEL > $MAXLEVEL ]]
then
	echo No more than $MAXLEVEL subversions, please.
	exit 1
fi

VER=$(grep "Version[ ]*=" $FILE \
	| grep -o -P "[0-9]+(\.[0-9]+)*")

NEWVER=

div=
i=0
for SUB in $(echo $VER | tr "\." "\n")
do
	if [[ $i == $LEVEL ]]
	then
		NEWVER=$NEWVER$div$(expr $SUB + 1)
		i=$(expr $i + 1)
		break
	fi
	
	NEWVER=$NEWVER$div$SUB
	div=.
	i=$(expr $i + 1)
done

if [[ $(expr $i - 1) != $LEVEL ]]
then
	NEWVER=$NEWVER$div\1
fi

# Stash any other changes in the working directory
# This seems to cause bugs.
#git stash save &> /dev/null

#sed -i "s/\"$VER\"/\"$NEWVER\"/" $FILE

# We're just going to add the file with
# the version constant.
git add $FILE

# Then amend it to the most recent commit.
git commit -m "Version $NEWVER"

if [[ $? != 0 ]]
then
	echo Commit and tagging aborted.
	exit 1
fi

TAGTYPE="-a"
if [[ $LEVEL == 0 ]] && [[ $SIGNBASE == TRUE ]]
then
	TAGTYPE="-s"
fi

# Now we make the tag,
git tag $SIGNING -m "Version $NEWVER" v$NEWVER 

# and reapply any old changes.
# See above.
#git stash apply &> /dev/null

echo Tagged as v$NEWVER
exit 0

