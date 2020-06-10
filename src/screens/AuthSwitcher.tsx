import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppContainer from "./AppContainer";
import AuthContainer from "./AuthContainer";
import { auth } from "../firebase";
import { useStore } from "../Store";
const linking = {
  prefixes: ["https://parti.mx", "parti-mx://"],
  config: {
    Profile: "profile",
    Login: "login",
    SignupEmail: "SignupEmail",
  },
};
export default function AuthSwithcer() {
  const [user, setUser] = React.useState(undefined);
  const [{ user_id }] = useStore();
  React.useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <NavigationContainer linking={linking}>
      {user && user_id !== null ? <AppContainer /> : <AuthContainer />}
    </NavigationContainer>
  );
}
