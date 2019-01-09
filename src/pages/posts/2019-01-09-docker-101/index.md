---
path: '/posts/docker-101'
date: '2019-01-09'
title: 'Dockerfile 작성부터 이미지 배포까지 간단 요약'
category: 'Docker'
tags:
  - Docker
description: 'Docker를 처음 써보면서 Dockerfile 작성부터 허브에 이미지 배포까지 경험한 과정한 간단히 정리했습니다'
---

## Dockerfile 작성까지

지금까지 회사에서 CI 빌드 및 배포용 도커 이미지로 [이런 것을](https://github.com/kriasoft/docker-node-ci) 쓰고 있었는데, 만들어진지 1년이 넘은 설정인데다 타겟 노드 버전에 문제가 있어 이번에 새로 이미지를 만들어보기로 했다. 주된 원인은 `create-react-app` v2.1 기반으로 프로젝트를 변경하다 보니 주요 의존성 중 하나인 `eslint` 가 해당 노드 버전을 지원하지 않는다는 에러가 나면서 CI가 실패했기 때문이다.

그래서 **답답하니 내가 뛴다** 정신을 발휘하여 `Dockerfile` 을 새로 작성하고 [Docker Hub](hub.docker.com)에 배포하는 작업까지 도전해보았다. 너무 당연한거지만 최소한 로컬 머신에 Docker CLI(보통은 Docker Desktop과 함께 설치)는 설치되어 있어야 한다.

이번 이미지를 사용하면서 베이스가 된 이미지는 Node.js 공식 도커 이미지이다. 그 중에 `node:dubnium-alpine` 을 사용했다. `dubnium` 은 v10 의 코드 이름이며, v10이 현재 LTS이기 일일이 버전을 지정해주는 것 보다 낫다고 판단했다. `lts-alpine` 이라고 하면 메이저 lts가 바뀌었을 때 큰 문제가 발생할 수도 있다고(김칫국을 마시고) 지양했다. `alpine` 은 알파인 리눅스 기반 이미지를 이야기하는데, 컨테이너 환경에 특화된 가볍고 안정적인 리눅스라는 것 같다.

그래서 기존에 사용하던 이미지의 코드 및, [Circle CI의 문서](https://circleci.com/docs/2.0/custom-images/) 등을 참고하여 처음으로 `Dockerfile` 을 만들어봤다.

```docker
FROM node:dubnium-alpine

ENV AWS_CLI_VERSION 1.16.83
ENV DOCKER_COMPOSE_VERSION 1.23.2
ENV WATCHMAN_VERSION 4.9.0

RUN set -ex \
    && apk add --no-cache bash git openssl-dev openssh-client ca-certificates curl g++ libc6-compat \
      linux-headers make autoconf automake libtool python3 python3-dev libc6-compat \
    # Upgrade pip
    && python3 -m ensurepip \
    && rm -r /usr/lib/python*/ensurepip \
    && pip3 install --no-cache-dir --upgrade pip setuptools \
    # Install AWS CLI
    && pip3 install awscli==${AWS_CLI_VERSION} \
    && aws --version \
    # Install Docker
    && apk add --no-cache docker \
    # Install Docker Compose
    && pip3 install docker-compose==${DOCKER_COMPOSE_VERSION} \
    # Install Watchman
    && cd /tmp; curl -LO https://github.com/facebook/watchman/archive/v${WATCHMAN_VERSION}.tar.gz \
    && tar xzf v${WATCHMAN_VERSION}.tar.gz; rm v${WATCHMAN_VERSION}.tar.gz \
    && cd watchman-${WATCHMAN_VERSION} \
    && ./autogen.sh; ./configure; make && make install \
    && cd /tmp; rm -rf watchman-${WATCHMAN_VERSION} \
    # Fix Yarn configuration
    && npm config set scripts-prepend-node-path true \
    && yarn --version
```

## 이미지 생성

```
# Dockerfile 이 있는 폴더에서 실행
# -t 옵션은 생성된 이미지에 이름을 매기는 것 {저장소 이름}:{태그} 로 입력한다
docker build -t rinae/node-ci-alpine:1.0.0 .
```

처음에는 설치한 주요 패키지의 버전 확인하는 커맨드를 안넣었더니, 커맨드 오류로 제대로 설치가 되지 않더라도 스무스하게 넘어가는 문제가 있었다. 그래서 버전 확인하는 커맨드를 추가해주었다. 그리고 이번에 알게 된건데 `pip` 로 패키지를 설치할 때 특정 버전을 지정하고자 한다면 `{PACKAGE_NAME}=={VERSION}` 입력 시 등호가 한 개가 아니라 **두 개** 라는 것이다. 처음에 한개 넣어놓고 이미지 배포했다가 CI에서 터져서 이미지를 다시 생성했다.

## 만들어진 이미지 삭제

처음에는 위의 방법처럼 해서 `1.0.1` 버전을 만들었는데 애초에 잘못된 이미지이니 `1.0.0` 으로 다시 만들어야겠다는 생각이 들었다. 그래서 기존에 만들었던 이미지를 지우는 명령어를 입력했다.

```
# 빌드 된 이미지 확인
docker images

# -f(--force) 옵션 없인 실행이 안되었다.
docker rmi -f {이미지 해시}
```

## 이미지 이름(태그) 바꾸기

기존의 `1.0.0` 이미지를 지워버렸고, 아까 만들었던 `1.0.1` 의 이름을 돌려놓고 싶어서 검색을 해 보니 `docker tag` 명령어를 사용하면 간단히 해결되었다. 다만 이름이 바로 바뀌는게 아니라 기존의 이미지 이름은 남아있기 때문에 지우는 명령어는 따로 실행해주어야 한다.

```
docker tag {옛날 이름} {새 이름}
docker rmi {옛날 이름}
```

## 이미지 Docker Hub에 배포하기

CLI에서 로그인을 해 준다음에 간단한 명령어만 입력하면 손쉽게 Docker Hub로 이미지가 올라간다.

```
docker login # 아이디와 비밀번호 입력
docker push {이미지명}:{태그명}
```

그럼 [이렇게](https://hub.docker.com/r/rinae/node-ci-alpine) 이미지 배포 완료.

[Dockerfile도 Github 저장소에 올려두었다.](https://github.com/adhrinae/node-ci-alpine) 더 잘 아는 분들의 조언 부탁합니다.

## 참고 자료

- [GitHub - nodejs/docker-node: Official Docker Image for Node.js](https://github.com/nodejs/docker-node)
- [Using Custom-Built Docker Images - CircleCI](https://circleci.com/docs/2.0/custom-images/)
- [초보를 위한 도커 안내서 - 설치하고 컨테이너 실행하기](https://subicura.com/2017/01/19/docker-guide-for-beginners-2.html)