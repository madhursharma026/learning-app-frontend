import * as React from 'react';
import Home from '../screens/Home';
import More from '../screens/More';
import SVG from '../constants/svgs';
import Convo from '../screens/Convo';
import Learn from '../screens/Learn';
import COLORS from '../themes/colors';
import Classes from '../screens/Classes';
import { useSelector } from 'react-redux';
import SCREENS from '../constants/screens';
import { RootState } from '../redux/store';
import { STRINGS } from '../constants/strings';
import { TabIcon } from '../components/TabIcon';
import commonStyles from '../themes/commonStyles';
import VideoCall from '../components/VideoCall/VideoCall';
import ClassDetails from '../screens/Classes/ClassDetails';
import { RoomPage } from '../components/AudioCall/RoomPage';
import QuesSection from '../components/LearnTab/QuesSection';
import CallingPage from '../components/AudioCall/CallingPage';
import BrodcastStream from '../components/VideoCall/BrodcastCall';
import ScoreCardScreen from '../components/LearnTab/ScoreCardScreen';
import DescriptionScreen from '../components/LearnTab/DescriptionScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Question from '../components/LearnTab/Question';
import Profile from '../components/Profile/Profile';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTab() {
  const theme = useSelector((state: RootState) => state.themeReducer);
  const colors = theme.colors;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          commonStyles.tabBarStyle,
          { backgroundColor: colors.HEADER_BG_COLOR },
        ],
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={SCREENS.HOME}
        component={Home}
        options={{
          tabBarIcon: ({ focused }) =>
            TabIcon({
              tabBarLabel: STRINGS.HOME,
              focused,
              activeIcon: SVG.ACTIVE_HOME_TAB_ICON,
              inActiveIcon: SVG.INACTIVE_HOME_TAB_ICON,
              labelColor: COLORS.LIGHT_GREEN,
            }),
        }}
      />
      <Tab.Screen
        name={SCREENS.CLASSES}
        component={Classes}
        options={{
          tabBarIcon: ({ focused }) =>
            TabIcon({
              tabBarLabel: STRINGS.CLASSES,
              focused,
              activeIcon: SVG.ACTIVE_CLASSES_TAB_ICON,
              inActiveIcon: SVG.INACTIVE_CLASSES_TAB_ICON,
              labelColor: COLORS.DARK_YELLOW,
            }),
        }}
      />
      <Tab.Screen
        name={SCREENS.CONVO}
        component={Convo}
        options={{
          tabBarIcon: ({ focused }) =>
            TabIcon({
              tabBarLabel: STRINGS.CONVO,
              focused,
              activeIcon: SVG.ACTIVE_CONVO_TAB_ICON,
              inActiveIcon: SVG.INACTIVE_CONVO_TAB_ICON,
              labelColor: COLORS.BLUE_LIGHT,
            }),
        }}
      />
      <Tab.Screen
        name={SCREENS.LEARN}
        component={Learn}
        options={{
          tabBarIcon: ({ focused }) =>
            TabIcon({
              tabBarLabel: STRINGS.LEARN,
              focused,
              activeIcon: SVG.ACTIVE_LEARN_TAB_ICON,
              inActiveIcon: SVG.INACTIVE_LEARN_TAB_ICON,
              labelColor: COLORS.PURPLE_LIGHT,
            }),
        }}
      />
      <Tab.Screen
        name={SCREENS.MORE}
        component={More}
        options={{
          tabBarIcon: ({ focused }) =>
            TabIcon({
              tabBarLabel: STRINGS.MORE,
              focused,
              activeIcon: SVG.ACTIVE_MORE_TAB_ICON,
              inActiveIcon: SVG.INACTIVE_MORE_TAB_ICON,
              labelColor: COLORS.PINK_LIGHT,
            }),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name={SCREENS.HOME_TAB} component={HomeTab} />
      <RootStack.Screen name={SCREENS.VIDEO_CALL} component={VideoCall} />
      <RootStack.Screen name={'BrodcastStream'} component={BrodcastStream} />
      <RootStack.Screen name={SCREENS.CLASS_DETAILS} component={ClassDetails} />
      <RootStack.Screen name={'RoomPage'} component={RoomPage} />
      <RootStack.Screen name={'CallingPage'} component={CallingPage} />
      <RootStack.Screen name={'DescriptionScreen'} component={DescriptionScreen} />
      <RootStack.Screen name={'QuesSection'} component={QuesSection} />
      <RootStack.Screen name={'ScoreCardScreen'} component={ScoreCardScreen} />
      <RootStack.Screen name={'Question'} component={Question} />
      <RootStack.Screen name={'Profile'} component={Profile} />
    </RootStack.Navigator>
  );
}

export default AppNavigator;
