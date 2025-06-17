import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Platform,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputContentSizeChangeEventData,
  // TextInputChangeEventData, // Not directly used as onChangeText is preferred
} from 'react-native';
import BottomRightLabel from '../bottomRightLabel';

import Line, { LineProps } from '../line';
import Label, { LabelProps } from '../label';
import Affix from '../affix';
import Helper from '../helper';
import Counter from '../counter';

import styles from './styles';

export interface ContentInset {
  top: number;
  label: number;
  input: number;
  left: number;
  right: number;
  bottom: number;
}

export interface LabelOffset {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface FieldProps extends TextInputProps {
  animationDuration?: number;
  fontSize?: number;
  labelFontSize?: number;
  contentInset?: ContentInset;
  labelOffset?: LabelOffset;
  labelTextStyle?: StyleProp<TextStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  affixTextStyle?: StyleProp<TextStyle>;
  tintColor?: string;
  textColor?: string;
  baseColor?: string;
  lineColor?: string;
  lineTintColor?: string;
  disabledLineColor?: string;
  label?: string;
  title?: string;
  characterRestriction?: number;
  bottomRightText?: string;
  error?: string;
  errorColor?: string;
  lineWidth?: number;
  activeLineWidth?: number;
  disabledLineWidth?: number;
  lineType?: LineProps['lineType'];
  disabledLineType?: LineProps['lineType'];
  disabled?: boolean;
  onPressRightText?: () => void;
  formatText?: (text: string) => string;
  renderLeftAccessory?: () => JSX.Element;
  renderRightAccessory?: () => JSX.Element;
  prefix?: string;
  suffix?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  bottomLabelStyle?: StyleProp<ViewStyle>;
  testIDHelper?: string;
  accessibilityLabelHelper?: string;
  testIDRightText?: string;
  accessibilityLabelRightText?: string;
  labelColor?: string;
  outerPrefix?: React.ReactNode;
  outerContainer?: StyleProp<ViewStyle>;
  lineContainer?: StyleProp<ViewStyle>;
  // Allow 'value' to be explicitly null for clearing or uncontrolled state
  value?: string | null;

  // For FieldOutlined customization
  onTextLayoutForLabel?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
  LineComponent?: React.FC<any>; // Allow any component that can take LineProps-like props + labelWidth for Outline
}

// Export for use in example app or other components if needed
export const defaultProps: Partial<FieldProps> = {
  underlineColorAndroid: 'transparent',
  disableFullscreenUI: true,
  autoCapitalize: 'sentences',
  editable: true,
  animationDuration: 225,
  fontSize: 16,
  labelFontSize: 12,
  tintColor: 'rgb(0, 145, 234)',
  textColor: 'rgba(0, 0, 0, .87)',
  baseColor: 'rgba(0, 0, 0, .38)',
  errorColor: 'rgb(213, 0, 0)',
  lineWidth: StyleSheet.hairlineWidth,
  activeLineWidth: 2,
  disabledLineWidth: 1,
  lineType: 'solid',
  disabledLineType: 'dotted',
  disabled: false,
};

const inputContainerStyleDefault = styles.inputContainer;

const contentInsetDefault: ContentInset = {
  top: 16,
  label: 4,
  input: 8,
  left: 0,
  right: 0,
  bottom: 8,
};

const labelOffsetDefault: LabelOffset = {
  x0: 0,
  y0: 0,
  x1: 0,
  y1: 0,
};

function startAnimatedTiming(animation: Animated.Value, options: Animated.TimingAnimationConfig, callback?: Animated.EndCallback) {
  Animated.timing(animation, options).start(callback);
}

export interface TextFieldMethods {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  value: () => string | undefined | null;
  isFocused: () => boolean;
  isErrored: () => boolean;
  setValue: (text?: string) => void;
}

const TextField = React.forwardRef<TextFieldMethods, FieldProps>((props, ref) => {
  const {
    animationDuration = defaultProps.animationDuration,
    fontSize = defaultProps.fontSize,
    labelFontSize = defaultProps.labelFontSize,
    contentInset: propsContentInset,
    labelOffset: propsLabelOffset,
    value: propsValue,
    defaultValue,
    error: propsError,
    editable = defaultProps.editable,
    disabled = defaultProps.disabled,
    placeholder,
    onChange,
    onChangeText: propsOnChangeText,
    onFocus: propsOnFocus,
    onBlur: propsOnBlur,
    clearTextOnFocus,
    formatText,
    onContentSizeChange: propsOnContentSizeChange,
    multiline,
    tintColor = defaultProps.tintColor,
    baseColor = defaultProps.baseColor,
    textColor = defaultProps.textColor,
    errorColor = defaultProps.errorColor,
    lineWidth = defaultProps.lineWidth,
    activeLineWidth = defaultProps.activeLineWidth,
    disabledLineWidth = defaultProps.disabledLineWidth,
    lineType = defaultProps.lineType,
    disabledLineType = defaultProps.disabledLineType,
    label,
    title,
    characterRestriction,
    bottomRightText,
    onPressRightText,
    renderLeftAccessory,
    renderRightAccessory,
    prefix,
    suffix,
    containerStyle,
    inputContainerStyle: inputContainerStyleOverrides,
    bottomLabelStyle,
    testIDHelper,
    accessibilityLabelHelper,
    testIDRightText,
    accessibilityLabelRightText,
    labelColor,
    labelTextStyle,
    titleTextStyle,
    affixTextStyle,
    outerPrefix,
    outerContainer,
    lineContainer,
    style: textInputStyleOverrides,
    height: propsHeight,
    allowFontScaling = true,
    // Customization props from FieldOutlined/Filled
    onTextLayoutForLabel,
    LineComponent = Line, // Default to Line component
    ...restInputProps
  } = { ...defaultProps, ...props };

  const [currentText, setCurrentText] = useState<string | undefined | null>(propsValue !== undefined ? propsValue : defaultValue);
  const [currentError, setCurrentError] = useState<string | undefined | null>(propsError);
  const [receivedFocus, setReceivedFocus] = useState(false);
  const [inputHeightState, setInputHeightState] = useState<number>(fontSize! * 1.5);
  const [isComponentFocused, setIsComponentFocused] = useState(false);

  const focusAnimation = useRef(new Animated.Value(determineErrorState(props) ? -1 : 0)).current;
  const labelAnimation = useRef(new Animated.Value(determineLabelState(props, currentText, false, false) ? 1 : 0)).current;
  const inputRef = useRef<TextInput>(null);
  const mountedRef = useRef(false);

  const contentInset = useMemo(() => ({ ...contentInsetDefault, ...propsContentInset }), [propsContentInset]);
  const labelOffset = useMemo(() => ({ ...labelOffsetDefault, ...propsLabelOffset }), [propsLabelOffset]);

  const determineErrorState = useCallback((p: FieldProps) => !!p.error, []);
  const determineLabelState = useCallback((p: FieldProps, text: string | null | undefined, focused: boolean, hasReceivedFocus: boolean) => {
    const { placeholder: currentPlaceholder, defaultValue: currentDefaultValue } = p;
    return !!(currentPlaceholder || text || (!hasReceivedFocus && currentDefaultValue));
  }, []);

  const errorStateVal = determineErrorState(props);
  const currentLabelStateVal = determineLabelState(props, currentText, isComponentFocused, receivedFocus);

  const focusState = useCallback(() => errorStateVal ? -1 : (isComponentFocused ? 1 : 0), [errorStateVal, isComponentFocused]);
  const calculatedLabelState = useCallback(() => currentLabelStateVal || isComponentFocused ? 1 : 0, [currentLabelStateVal, isComponentFocused]);

  const onFocusAnimationEnd = useCallback(() => {
    if (mountedRef.current && !propsError && currentError) {
      setCurrentError(null);
    }
  }, [propsError, currentError]);

  const startFocusAnimation = useCallback(() => {
    startAnimatedTiming(focusAnimation, {
      toValue: focusState(),
      duration: animationDuration,
      useNativeDriver: false,
    }, onFocusAnimationEnd);
  }, [focusAnimation, focusState, animationDuration, onFocusAnimationEnd]);

  const startLabelAnimation = useCallback(() => {
    startAnimatedTiming(labelAnimation, {
      toValue: calculatedLabelState(),
      duration: animationDuration,
      useNativeDriver: true,
    });
  }, [labelAnimation, calculatedLabelState, animationDuration]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (propsError !== currentError) {
      setCurrentError(propsError);
    }
  }, [propsError, currentError]);

  useEffect(() => {
    startFocusAnimation();
  }, [errorStateVal, startFocusAnimation]);

  useEffect(() => {
    if (propsValue !== undefined && propsValue !== currentText) {
      setCurrentText(propsValue);
    }
  }, [propsValue]);

  useEffect(() => {
    startLabelAnimation();
  }, [currentLabelStateVal, isComponentFocused, startLabelAnimation]);

  const handleFocus = useCallback((event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (propsOnFocus) {
      propsOnFocus(event);
    }
    if (clearTextOnFocus && inputRef.current) {
      inputRef.current.clear();
    }
    setIsComponentFocused(true);
    if (!receivedFocus) {
      setReceivedFocus(true);
      if (defaultValue && !clearTextOnFocus && currentText == null) {
        setCurrentText(defaultValue);
      }
    }
  }, [propsOnFocus, clearTextOnFocus, receivedFocus, defaultValue, currentText]);

  const handleBlur = useCallback((event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (propsOnBlur) {
      propsOnBlur(event);
    }
    setIsComponentFocused(false);
  }, [propsOnBlur]);

  const handleChangeText = useCallback((text: string) => {
    const formattedText = formatText ? formatText(text) : text;
    setCurrentText(formattedText);
    if (propsOnChangeText) {
      propsOnChangeText(formattedText);
    }
  }, [formatText, propsOnChangeText]);

  const handleContentSizeChange = useCallback((event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    if (propsOnContentSizeChange) {
      propsOnContentSizeChange(event);
    }
    const { height } = event.nativeEvent.contentSize;
    setInputHeightState(Math.max(fontSize!, Math.ceil(height) + Platform.select({ ios: 4, android: 1 })));
  }, [propsOnContentSizeChange, fontSize]);

  const handlePress = useCallback(() => {
    if (!disabled && editable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, editable]);

  const isFieldErroredInternal = useCallback(() => errorStateVal, [errorStateVal]);

  const isDefaultVisible = useCallback(() => {
    return !receivedFocus && currentText == null && defaultValue != null;
  }, [receivedFocus, currentText, defaultValue]);

  const valueToDisplay = isDefaultVisible() ? defaultValue : currentText;

  useImperativeHandle(ref, () => ({
    focus: () => { inputRef.current?.focus(); },
    blur: () => { inputRef.current?.blur(); },
    clear: () => {
      setCurrentText(undefined); // Clear internal state
      inputRef.current?.clear();
      if (propsOnChangeText) propsOnChangeText(''); // Notify parent
    },
    value: () => valueToDisplay,
    isFocused: () => isComponentFocused || (inputRef.current?.isFocused() || false),
    isErrored: () => isFieldErroredInternal(),
    setValue: (text?: string) => { // Allow undefined to clear, or empty string
      setCurrentText(text);
      // Note: This does not call propsOnChangeText, matching original class behavior for direct setValue
    },
  }));

  const dynamicInputHeight = useMemo(() => {
    if (propsHeight !== undefined) return propsHeight;
    return multiline ? inputHeightState : fontSize! * 1.5;
  }, [propsHeight, multiline, inputHeightState, fontSize]);

  const dynamicInputContainerHeight = useMemo(() => {
    if (Platform.OS === 'web' && multiline) return 'auto';
    return contentInset.top + labelFontSize! + contentInset.label + dynamicInputHeight + contentInset.input;
  }, [multiline, contentInset, labelFontSize, dynamicInputHeight]);

  const composedInputStyle = useMemo(() => {
    const color = disabled || isDefaultVisible() ? baseColor : textColor;
    const style: StyleProp<TextStyle> = {
      fontSize,
      color,
      height: dynamicInputHeight,
    };
    if (multiline) {
      const lineHeight = fontSize! * 1.5;
      const offset = Platform.OS === 'ios' ? 2 : 0;
      (style as any).height = (style as any).height + lineHeight; // TODO: check this
      (style as any).transform = [{ translateY: lineHeight + offset }];
    }
    return [styles.input, style, textInputStyleOverrides];
  }, [fontSize, baseColor, textColor, disabled, multiline, dynamicInputHeight, textInputStyleOverrides, isDefaultVisible]);


  const renderInput = () => (
    <TextInput
      ref={inputRef}
      selectionColor={tintColor}
      {...restInputProps}
      editable={!disabled && editable}
      onChange={onChange}
      onChangeText={handleChangeText}
      onContentSizeChange={handleContentSizeChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={valueToDisplay || ''} // Ensure value is not null/undefined for TextInput
      style={composedInputStyle}
      placeholder={isComponentFocused || !label ? placeholder : undefined}
      multiline={multiline}
    />
  );

  const renderAffixElement = (type: 'prefix' | 'suffix') => {
    const affixText = type === 'prefix' ? prefix : suffix;
    if (affixText == null) return null;
    return (
      <Affix
        type={type}
        style={affixTextStyle}
        color={baseColor!}
        fontSize={fontSize!}
        labelAnimation={labelAnimation}
      >
        {affixText}
      </Affix>
    );
  };

  const renderHelperElement = () => {
     const hasHelperText = title || currentError;
     const hasCounter = characterRestriction != null && currentText !=null; // only show counter if text is not null
     const hasBottomRightText = bottomRightText != null;

     if (!hasHelperText && !hasCounter && !hasBottomRightText) {
       return null;
     }
    return (
      <View style={[styles.helperContainer, { paddingLeft: contentInset.left, paddingRight: contentInset.right, minHeight: contentInset.bottom }, bottomLabelStyle, lineContainer]}>
        {(title || currentError) && (
          <Helper
            title={title}
            error={currentError || undefined}
            disabled={disabled}
            baseColor={baseColor!}
            errorColor={errorColor!}
            style={titleTextStyle}
            focusAnimation={focusAnimation}
            testID={testIDHelper}
            accessibilityLabel={accessibilityLabelHelper}
          />
        )}
        {characterRestriction != null && currentText != null && (
          <Counter
            count={currentText?.length || 0}
            limit={characterRestriction}
            baseColor={baseColor!}
            errorColor={errorColor!}
            style={titleTextStyle}
          />
        )}
        {bottomRightText && (
          <BottomRightLabel
            title={bottomRightText}
            onPress={onPressRightText}
            baseColor={baseColor!} // baseColor is required by BottomRightLabel
            rightTextStyle={titleTextStyle} // Assuming titleTextStyle can be used here
            testID={testIDRightText}
            accessibilityLabel={accessibilityLabelRightText}
          />
        )}
      </View>
    );
  };


  const renderLabelElement = () => {
    if (!label) return null;
    const labelProps: LabelProps = {
      label,
      offset: labelOffset,
      disabled: disabled!,
      restricted: isRestricted(),
      fontSize: fontSize!,
      activeFontSize: labelFontSize!,
      contentInset,
      errorColor: errorColor!,
      baseColor: baseColor!,
      tintColor: tintColor!,
      style: labelTextStyle,
      focusAnimation,
      labelAnimation,
      labelColor,
      allowFontScaling,
      onTextLayout: onTextLayoutForLabel, // Pass the custom onTextLayout
    };
    return <Label {...labelProps} />;
  };

  const renderLineElement = () => {
    const lineComponentProps: LineProps = { // Base props for Line/Outline
      disabled: disabled!,
      restricted: isRestricted(),
      lineType: lineType!, // Outline might not use this directly but Line does
      disabledLineType: disabledLineType!, // Outline might not use this
      lineWidth: lineWidth!,
      activeLineWidth: activeLineWidth!,
      disabledLineWidth: disabledLineWidth!,
      tintColor: tintColor!,
      baseColor: baseColor!,
      errorColor: errorColor!,
      lineColor,
      lineTintColor,
      disabledLineColor,
      focusAnimation,
      labelAnimation,
      contentInset,
      lineContainer,
      // labelWidth is specific to Outline, LineComponent will receive it if it's Outline
      // This relies on OutlineProps being compatible enough or LineComponent handling extra props.
      // If LineComponent is Outline, it expects labelWidth.
      // We need to ensure this prop is available if LineComponent is Outline.
      // This might require adding labelWidth to LineProps or a more specific type for LineComponent.
      // For now, we'll assume FieldOutlined passes it via {...props} and LineComponent (Outline) picks it up.
      // However, the current FieldProps does not include labelWidth.
      // This indicates that FieldOutlined's way of passing labelWidth by spreading it into TextField
      // might not be correctly typed if LineComponent is to be generic.
      // Let's assume for now that specific props for Outline are passed through restProps if not explicitly handled.
    };
     // The `labelWidth` prop for Outline is a special case.
    // If `LineComponent` is `Outline`, it will need `labelWidth`.
    // `FieldOutlined` passes all its props to `TextField`.
    // If `labelWidth` is among `restInputProps` (which it wouldn't be based on `FieldProps` definition)
    // or if `LineComponent` is passed already configured with its `labelWidth` (which is not the case here).
    // The `Outline` component from `FieldOutlined` needs `labelWidth`.
    // The `renderCustomLine` in `FieldOutlined` already has access to its own `labelWidth`.
    // So, when `FieldOutlined` provides `LineComponent`, it's a function that already incorporates `labelWidth`.
    return <LineComponent {...lineComponentProps} />;
  };


  const fieldContainerActualStyle: StyleProp<ViewStyle> = [
    styles.inputContainer, // Default styles.inputContainer from Field component
    {
      paddingTop: contentInset.top,
      paddingRight: contentInset.right,
      paddingBottom: contentInset.input, // Note: using contentInset.input for bottom padding
      paddingLeft: contentInset.left,
      height: dynamicInputContainerHeight,
    },
    inputContainerStyleOverrides, // User-provided overrides
  ];


  return (
    <View
      style={containerStyle}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handlePress}
      pointerEvents={!disabled && editable ? 'auto' : 'none'}
    >
      <Animated.View style={fieldContainerActualStyle}>
        {renderLineElement()}
        {renderLeftAccessory && renderLeftAccessory()}
        <View style={styles.stack}>
          {renderLabelElement()}
          <View style={styles.row}>
             {outerPrefix && <View style={outerContainer}>{outerPrefix}</View>}
            {renderAffixElement('prefix')}
            {renderInput()}
            {renderAffixElement('suffix')}
          </View>
        </View>
        {renderRightAccessory && renderRightAccessory()}
      </Animated.View>
      {renderHelperElement()}
    </View>
  );
};

(TextField as any).inputContainerStyle = inputContainerStyleDefault;
(TextField as any).contentInset = contentInsetDefault;
(TextField as any).labelOffset = labelOffsetDefault;

export default TextField;
