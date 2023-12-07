import { gql } from '@apollo/client';

export const AllClasses = gql`
mutation Mutation {
  teachingClasses {
    id
    title
    description
    startsAt
    teacherId
    createdAt
    updatedAt
    teacher {
      id
      firstName
      lastName
      mobileNumber
    }
    usersJoined {
      id
      firstName
      lastName
      mobileNumber
      profileImage
    }
  }
}
`

export const FetchQuestionsByChapterId = gql`
mutation Mutation($gettingChapterId: String!) {
  findQuestionByChapterId(gettingChapterId: $gettingChapterId) {
    id
    mainHeading
    Title
    Description
    Question
    Option1
    Option2
    Option3
    Option4
    correctAns
    IsOptionInImageFormate
    IsQuestionInMCQsFormate
    IsQuestionInInputFormate
    IsQuestionInImageFormate
    IsQuestionInFillUpsFormate
    chapterId
  }
}
`


// export const FetchUserReport = gql`
// mutation Mutation($gettingUserId: String!, $gettingChapterId: String!) {
//   findUserReportByIds(gettingUserId: $gettingUserId, gettingChapterId: $gettingChapterId) {
//     id
//     userReportUserId
//     userReportChapterId
//     doneAt
//   }
// }
// `

export const FetchUserReport = gql`
mutation Mutation($gettingUserId: String!) {
  findUserReportByIds(gettingUserId: $gettingUserId) {
    id
    userReportChapterId
    userReportUserId
    doneAt
  }
}
`


export const AddUserReport = gql`
mutation Mutation($addUsersReportArgs: AddUsersReportArgs!) {
  addUsersReport(addUsersReportArgs: $addUsersReportArgs) {
    id
    userReportChapterId
    userReportUserId
    doneAt
  }
}
`

export const GettingChapterById = gql`
mutation Mutation($gettingId: String!) {
  findChapterById(gettingId: $gettingId) {
    id
    chapterName
    chapterDescription
    createdAt
  }
}
`

export const EditUserProfile = gql`
mutation Mutation($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    id
      firstName
      lastName
      age
      mobileNumber
      verified
      level
      totalTalks
      createdAt
      updatedAt
      teachingClasses {
        id
        title
        startsAt
        description
        teacherId
        createdAt
        updatedAt
        usersJoined {
          id
          firstName
          lastName
          age
          mobileNumber
          verified
          level
          totalTalks
          createdAt
          updatedAt
        }
        teacher {
          id
          firstName
          lastName
          age
          mobileNumber
          verified
          createdAt
          updatedAt
        }
      }
      conversationsStarted {
        id
        isWaiting
        createdAt
        updatedAt
        conversationInitiator {
          id
          firstName
          lastName
          age
          mobileNumber
          verified
          level
          totalTalks
          createdAt
          updatedAt
        }
        conversationWith {
          id
          firstName
          lastName
          age
          mobileNumber
          verified
          level
          totalTalks
          createdAt
          updatedAt
        }
        isPair
      }
      conversationJoined {
        id
        isWaiting
        createdAt
        updatedAt
        isPair
      }
  }
}
`;

export const CallHistoryIncomming = gql`
mutation Mutation($joinRoomArgs: JoinRoomArgs!) {
  showMyAllCallsInLast24HrsIncomming(joinRoomArgs: $joinRoomArgs) {
    id
    roomName
    participants
    firstParticipantMobileNumber
    firstParticipantToken
    secondParticipantMobileNumber
    secondParticipantToken
    createdAt
    endedAt
  }
}
`;

export const CallHistoryOutGoing = gql`
mutation Mutation($joinRoomArgs: JoinRoomArgs!) {
  showMyAllCallsInLast24HrsOutGoing(joinRoomArgs: $joinRoomArgs) {
    id
    roomName
    participants
    firstParticipantMobileNumber
    firstParticipantToken
    secondParticipantMobileNumber
    secondParticipantToken
    createdAt
    endedAt
  }
}
`;

export const EndCall = gql`
mutation Mutation($callEndArgs: CallEndArgs!) {
  callEnd(callEndArgs: $callEndArgs) {
    id
    roomName
    participants
    firstParticipantToken
    secondParticipantToken
    createdAt
    endedAt
  }
}
`;

export const AllQuestions = gql`
mutation Questions {
  questions {
    id
    mainHeading
    Title
    Description
    Question
    Option1
    Option2
    Option3
    Option4
    correctAns
    IsOptionInImageFormate
    IsQuestionInMCQsFormate
    IsQuestionInInputFormate
    IsQuestionInImageFormate
    IsQuestionInFillUpsFormate
    chapterId
  }
}
`;

export const JoinRoomMutation = gql`
mutation JoinRoom($joinRoomArgs: JoinRoomArgs!) {
  joinRoom(joinRoomArgs: $joinRoomArgs) {
    id
    roomName
    participants
    firstParticipantToken
    secondParticipantToken
    createdAt
  }
}
`;

export const roomConnectingToOtherMutation = gql`
mutation ConnectingRoom($joinRoomArgs: JoinRoomArgs!) {
  connectingRoom(joinRoomArgs: $joinRoomArgs) {
    createdAt
    firstParticipantToken
    id
    participants
    roomName
    secondParticipantToken
    firstParticipantMobileNumber
    secondParticipantMobileNumber
  }
}
`

export const FIRST_SETP_USER_LOGIN = gql`
  mutation FirstStepUserLogin($firstStepUserLoginInput: FirstStepLoginInput!) {
    firstStepUserLogin(firstStepUserLoginInput: $firstStepUserLoginInput) {
      id
    }
  }
`;

export const USER_LOGIN_VERIFICATION = gql`
  mutation UserLoginVerification(
    $loginVerificationInput: LoginVerificationInput!
  ) {
    userLoginVerification(loginVerificationInput: $loginVerificationInput) {
      jwtToken
      refreshToken
    }
  }
`;

export const INITIATE_CONVERSATION = gql`
  mutation InitiateConversation {
    initiateConversation {
      id
      isWaiting
      createdAt
      updatedAt
      conversationInitiator {
        id
        firstName
        lastName
        age
        mobileNumber
        verified
        level
        totalTalks
        createdAt
        updatedAt
        teachingClasses {
          id
          title
          startsAt
          description
          teacherId
          createdAt
          updatedAt
          usersJoined {
            id
            firstName
            lastName
            age
            mobileNumber
            verified
            level
            totalTalks
            createdAt
            updatedAt
          }
          teacher {
            id
            firstName
            lastName
            age
            mobileNumber
            verified
            createdAt
            updatedAt
          }
        }
        conversationsStarted {
          id
          isWaiting
          createdAt
          updatedAt
          isPair
        }
        conversationJoined {
          id
          isWaiting
          createdAt
          updatedAt
          isPair
        }
      }
      conversationWith {
        id
        firstName
        lastName
        age
        mobileNumber
        verified
        level
        totalTalks
        createdAt
        updatedAt
      }
      isPair
    }
  }
`;

export const PAIR_MATCHES = gql`
  subscription Subscription {
    pairMatched {
      id
      isWaiting
      createdAt
      updatedAt
      conversationInitiator {
        id
        firstName
        lastName
        age
        mobileNumber
        verified
        level
        totalTalks
        createdAt
        updatedAt
        teachingClasses {
          id
          title
          startsAt
          description
          teacherId
          createdAt
          updatedAt
          usersJoined {
            id
            firstName
            lastName
            age
            mobileNumber
            verified
            level
            totalTalks
            createdAt
            updatedAt
          }
          teacher {
            id
            firstName
            lastName
            age
            mobileNumber
            verified
            createdAt
            updatedAt
          }
        }
        conversationsStarted {
          id
          isWaiting
          createdAt
          updatedAt
          isPair
        }
        conversationJoined {
          id
          isWaiting
          createdAt
          updatedAt
          isPair
        }
      }
      conversationWith {
        id
        firstName
        lastName
        age
        mobileNumber
        verified
        level
        totalTalks
        createdAt
        updatedAt
      }
      isPair
    }
  }
`;
