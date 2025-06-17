import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import { RaisedTextButton } from 'react-native-material-buttons';
// Updated import to local TextField and its defaultProps
import TextField, { defaultProps as textFieldDefaultProps } from '../src/components/field';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Define styles with StyleSheet for better type checking and potential optimizations
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'transparent',
  },

  container: {
    margin: 8,
    marginTop: Platform.select({ ios: 8, android: 32 }),
    flex: 1,
  },

  contentContainer: {
    padding: 8,
  },

  buttonContainer: {
    paddingTop: 8,
    margin: 8,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
});

interface ExampleState {
  firstname: string;
  lastname: string;
  about: string;
  email?: string; // Optional as it can be empty initially
  password?: string; // Optional
  secureTextEntry: boolean;
  errors?: { [key: string]: string };
  house?: string; // From disabled field
}

// Define types for refs for better type safety
interface FieldRef {
  focus: () => void;
  blur: () => void;
  value: () => string;
  isFocused: () => boolean;
  // Add other methods if used, e.g., clear, setValue, isErrored
}

const defaults = {
  firstname: 'Eddard',
  lastname: 'Stark',
  about: 'Stoic, dutiful, and honorable man, considered to embody the values of the North',
};

export default function init() {
  class Example extends Component<{}, ExampleState> {
    // Explicitly type refs
    firstname: FieldRef | null = null;
    lastname: FieldRef | null = null;
    about: FieldRef | null = null;
    email: FieldRef | null = null;
    password: FieldRef | null = null;
    house: FieldRef | null = null;

    constructor(props: {}) {
      super(props);

      this.onFocus = this.onFocus.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onChangeText = this.onChangeText.bind(this); // This will need adjustment for individual fields
      this.onSubmitFirstName = this.onSubmitFirstName.bind(this);
      this.onSubmitLastName = this.onSubmitLastName.bind(this);
      this.onSubmitAbout = this.onSubmitAbout.bind(this);
      this.onSubmitEmail = this.onSubmitEmail.bind(this);
      this.onSubmitPassword = this.onSubmitPassword.bind(this);
      this.onAccessoryPress = this.onAccessoryPress.bind(this);

      this.firstnameRef = this.updateRef.bind(this, 'firstname');
      this.lastnameRef = this.updateRef.bind(this, 'lastname');
      this.aboutRef = this.updateRef.bind(this, 'about');
      this.emailRef = this.updateRef.bind(this, 'email');
      this.passwordRef = this.updateRef.bind(this, 'password');
      this.houseRef = this.updateRef.bind(this, 'house');

      this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

      this.state = {
        secureTextEntry: true,
        ...defaults,
        errors: {}, // Ensure errors is initialized
      };
    }

    onFocus() {
      let { errors = {} } = this.state;
      const newErrors = { ...errors };

      for (const name in newErrors) {
        const ref = this[name as keyof Example] as FieldRef | null;
        if (ref && ref.isFocused()) {
          delete newErrors[name as keyof ExampleState['errors']];
        }
      }

      if (Object.keys(newErrors).length < Object.keys(errors).length) {
        this.setState({ errors: newErrors });
      }
    }

    // onChangeText needs to be field-specific for functional components
    // The previous shared onChangeText relied on knowing which field was focused.
    // Now, each TextField will have its own onChangeText handler.
    handleTextChange(fieldName: keyof ExampleState) {
      return (text: string) => {
        this.setState({ [fieldName]: text } as unknown as Pick<ExampleState, keyof ExampleState>);
      };
    }

    onAccessoryPress() {
      this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry }));
    }

    onSubmitFirstName() {
      this.lastname?.focus();
    }

    onSubmitLastName() {
      this.about?.focus();
    }

    onSubmitAbout() {
      this.email?.focus();
    }

    onSubmitEmail() {
      this.password?.focus();
    }

    onSubmitPassword() {
      this.password?.blur();
    }

    onSubmit() {
      const errors: { [key: string]: string } = {};
      const fieldsToValidate: (keyof ExampleState)[] = ['firstname', 'lastname', 'email', 'password'];

      fieldsToValidate.forEach((name) => {
        const fieldRef = this[name as keyof Example] as FieldRef | null;
        if (fieldRef) {
          const value = fieldRef.value();
          if (!value) {
            errors[name] = 'Should not be empty';
          } else if (name === 'password' && value.length < 6) {
            errors[name] = 'Too short';
          }
        }
      });

      this.setState({ errors });
    }

    updateRef(name: keyof Example, ref: FieldRef | null) {
      this[name] = ref;
    }

    renderPasswordAccessory() {
      const { secureTextEntry } = this.state;
      const name = secureTextEntry ? 'visibility' : 'visibility-off';

      return (
        <MaterialIcon
          size={24}
          name={name}
          color={textFieldDefaultProps.baseColor} // Use imported defaultProps
          onPress={this.onAccessoryPress}
          suppressHighlighting={true}
        />
      );
    }

    render() {
      const { errors = {}, secureTextEntry, ...data } = this.state;
      const { firstname = '', lastname = '' } = data; // Ensure defaults for defaultEmail

      const defaultEmail = `${firstname || 'name'}@${lastname || 'house'}.com`
        .replace(/\s+/g, '_')
        .toLowerCase();

      return (
        <SafeAreaView style={styles.safeContainer}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps='handled'
          >
            <View style={styles.container}>
              <TextField
                ref={this.firstnameRef}
                value={defaults.firstname}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitFirstName}
                returnKeyType='next'
                label='First Name'
                error={errors.firstname}
              />

              <TextField
                ref={this.lastnameRef}
                value={defaults.lastname}
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitLastName}
                returnKeyType='next'
                label='Last Name'
                error={errors.lastname}
              />

              <TextField
                ref={this.aboutRef}
                value={defaults.about}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitAbout}
                returnKeyType='next'
                multiline={true}
                blurOnSubmit={true}
                label='About (optional)'
                characterRestriction={140}
              />

              <TextField
                ref={this.emailRef}
                defaultValue={defaultEmail}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitEmail}
                returnKeyType='next'
                label='Email Address'
                error={errors.email}
              />

              <TextField
                ref={this.passwordRef}
                secureTextEntry={secureTextEntry}
                autoCapitalize='none'
                autoCorrect={false}
                enablesReturnKeyAutomatically={true}
                clearTextOnFocus={true}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                onSubmitEditing={this.onSubmitPassword}
                returnKeyType='done'
                label='Password'
                error={errors.password}
                title='Choose wisely'
                maxLength={30}
                characterRestriction={20}
                renderRightAccessory={this.renderPasswordAccessory}
              />

              <TextField
                ref={this.houseRef}
                defaultValue={data.lastname}
                label='House'
                title='Derived from last name'
                disabled={true}
              />
            </View>

            <View style={styles.buttonContainer}>
              <RaisedTextButton
                onPress={this.onSubmit}
                title='submit'
                color={TextField.defaultProps.tintColor}
                titleColor='white'
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  AppRegistry.registerComponent('example', () => Example);
}
