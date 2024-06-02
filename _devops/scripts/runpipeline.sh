#!/bin/bash
set -e

if [[ ! -z "$GIT_BRANCH" ]] ; then
    GIT_BRANCH=`echo $GIT_BRANCH | sed "s,origin/,,"`
    GIT_REF="refs/heads/$GIT_BRANCH"
fi

GIT_REF=${GIT_REF:-"$GITHUB_REF"}
GIT_COMMIT=${GIT_COMMIT:-"$GITHUB_SHA"}
ENV=${ENV:-"dev"}
CAPITALIZED_ENV=$(echo ${ENV} | tr [a-z] [A-Z])
IMAGE_TAG=${IMAGE_TAG:-"$GIT_COMMIT"}
PIPELINE=${PIPELINE:-"poc-vault"}


WORKSPACE="$PWD"
TEKTON_HOST=${TEKTON_HOST:-"https://"}

if [[ ! -z "$GITHUB_WORKSPACE" ]] ; then
    WORKSPACE=$GITHUB_WORKSPACE
fi

jq ".Git.Ref=\"$GIT_REF\"|.Git.Revision=\"$GIT_COMMIT\"|.Image.Tag=\"$IMAGE_TAG\"" \
    $WORKSPACE/devops/tekton/trigger-$ENV.json > trigger.json

cat trigger.json

export EVENT_ID=`curl $TEKTON_HOST/v1/$PIPELINE \
    -d @trigger.json | jq -r '.eventID'`

echo Execution Logs:

## Slack Notification
cat > slack-notification.json <<EOF
{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*$CAPITALIZED_ENV: DX DEPLOYMENT STARTED*"
			}
		},
		{
			"type": "section",
			"fields": [
                {
					"type": "mrkdwn",
					"text": "*IMAGE_TAG:*\n$IMAGE_TAG"
				},
				{
					"type": "mrkdwn",
					"text": "*Git_Commit_Id:*\n$GIT_COMMIT"
				},
				{
					"type": "mrkdwn",
					"text": "*Git_Branch:*\n$GIT_REF"
				},
				{
					"type": "mrkdwn",
					"text": "*Execution_Logs:"
				}
			]
		},
    {
			"type": "divider"
		}
	]
}
EOF

curl -X POST -H 'Content-type: application/json' --data @slack-notification.json $SLACK_WEBHOOK_URL

tknwatch

exitCode=$?

if [[ $exitCode -gt 0 ]]; ##failure
then
    sed -i 's,STARTED,FAILED :x:,' slack-notification.json
    curl -X POST -H 'Content-type: application/json' --data @slack-notification.json $SLACK_WEBHOOK_URL
    exit $exitCode
fi

##success
sed -i 's,STARTED,COMPLETED :white_check_mark:,' slack-notification.json
curl -X POST -H 'Content-type: application/json' --data @slack-notification.json $SLACK_WEBHOOK_URL
