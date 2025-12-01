import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { UserData } from '../../types';

type ProfileScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Profile'
>;

interface ProfileProps {
    navigation: ProfileScreenNavigationProp;
    route: {
        params: {
            userData: UserData;
        };
    };
}

const { width } = Dimensions.get('window');

const Profile: React.FC<ProfileProps> = ({ navigation, route }) => {
    const { userData } = route.params;

    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(userData.firstName);
    const [lastName, setLastName] = useState(userData.lastName);
    const [email, setEmail] = useState(userData.email);
    const [username, setUsername] = useState(userData.username);

    const handleSave = () => {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setUsername(userData.username);
        setIsEditing(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Profile</Text>
                    <TouchableOpacity
                        onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
                        style={styles.editButton}
                    >
                        <MaterialIcons name={isEditing ? 'check' : 'edit'} size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Profile Picture */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{
                                    uri: userData.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                                }}
                                style={styles.avatar}
                            />
                            {isEditing && (
                                <TouchableOpacity style={styles.cameraButton}>
                                    <MaterialIcons name="camera-alt" size={20} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.userName}>{firstName} {lastName}</Text>
                        <Text style={styles.userEmail}>@{username}</Text>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>7</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Sessions</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>85%</Text>
                            <Text style={styles.statLabel}>Mindful</Text>
                        </View>
                    </View>

                    {/* Personal Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#6C63FF" />
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    editable={isEditing}
                                    placeholder="First Name"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color="#6C63FF" />
                                <TextInput
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    editable={isEditing}
                                    placeholder="Last Name"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="at" size={20} color="#6C63FF" />
                                <TextInput
                                    style={styles.input}
                                    value={username}
                                    onChangeText={setUsername}
                                    editable={isEditing}
                                    placeholder="Username"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#6C63FF" />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    editable={isEditing}
                                    placeholder="Email"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Preferences */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>

                        <TouchableOpacity style={styles.preferenceItem}>
                            <View style={styles.preferenceLeft}>
                                <MaterialIcons name="notifications-none" size={24} color="#6C63FF" />
                                <Text style={styles.preferenceText}>Notifications</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.preferenceItem}>
                            <View style={styles.preferenceLeft}>
                                <MaterialIcons name="dark-mode" size={24} color="#6C63FF" />
                                <Text style={styles.preferenceText}>Dark Mode</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.preferenceItem}>
                            <View style={styles.preferenceLeft}>
                                <MaterialIcons name="language" size={24} color="#6C63FF" />
                                <Text style={styles.preferenceText}>Language</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {isEditing && (
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0A0E17',
    },
    container: {
        flex: 1,
        backgroundColor: '#0A0E17',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#6C63FF',
        padding: 16,
    },
    backButton: {
        padding: 8,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    editButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#1A1F2E',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#6C63FF',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6C63FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#1A1F2E',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#8A8D9F',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1F2E',
        marginHorizontal: 20,
        marginTop: -20,
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6C63FF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#8A8D9F',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#2A2F3E',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#8A8D9F',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1F2E',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#2A2F3E',
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#fff',
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1A1F2E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    preferenceText: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 12,
    },
    cancelButton: {
        backgroundColor: '#E74C3C',
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 32,
    },
});

export default Profile;
