#!/bin/bash

set -e
PATH=./node_modules/.bin:$PATH

# Export environment variables from `.env`
if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

# //////////////////////////////////////////////////////////////////////////////
# START tasks

build() {
  jvdx build --clean -f modern,cjs,esm --no-sourcemap --no-sourcemap
}

format() {
  jvdx format $*
}

lint() {
  jvdx lint $*
}

test() {
  jvdx test --testPathPattern=/tests --passWithNoTests --env=jsdom $*
}

e2e() {
  echo ""
  echo "info - Running e2e tests"
  echo ""
  export CYPRESS_CRASH_REPORTS=0
  cypress run -q
}

validate() {
  lint $*
  test $*
  e2e $*
}

clean() {
  jvdx clean $*
}

default() {
  build
}

# END tasks
# //////////////////////////////////////////////////////////////////////////////

${@:-default}
