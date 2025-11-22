// Mock authentication system using localStorage
// This replaces Firebase Auth for local development

class MockAuth {
    constructor() {
        this.currentUser = null;
        this.listeners = [];
        this.init();
    }

    init() {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('mockUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
        // Trigger initial auth state
        setTimeout(() => {
            this.notifyListeners();
        }, 100);
    }

    onAuthStateChanged(callback) {
        this.listeners.push(callback);
        // Immediately call with current state
        callback(this.currentUser);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentUser));
    }

    async signInWithEmailAndPassword(email, password) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check if user exists
        const users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
        const user = users[email];

        if (!user) {
            throw new Error('User not found. Please sign up first.');
        }

        if (user.password !== password) {
            throw new Error('Invalid password');
        }

        this.currentUser = {
            uid: user.uid,
            email: email,
            displayName: user.displayName || email.split('@')[0]
        };

        localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
        this.notifyListeners();

        return { user: this.currentUser };
    }

    async createUserWithEmailAndPassword(email, password) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('mockUsers') || '{}');

        if (users[email]) {
            throw new Error('Email already in use');
        }

        // Create new user
        const uid = 'user_' + Date.now();
        users[email] = {
            uid: uid,
            email: email,
            password: password,
            displayName: email.split('@')[0]
        };

        localStorage.setItem('mockUsers', JSON.stringify(users));

        this.currentUser = {
            uid: uid,
            email: email,
            displayName: email.split('@')[0]
        };

        localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
        this.notifyListeners();

        return { user: this.currentUser };
    }

    async signOut() {
        this.currentUser = null;
        localStorage.removeItem('mockUser');
        this.notifyListeners();
    }
}

// Mock Firestore
class MockFirestore {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('mockFirestore') || '{}');
    }

    save() {
        localStorage.setItem('mockFirestore', JSON.stringify(this.data));
    }

    collection(name) {
        if (!this.data[name]) {
            this.data[name] = {};
        }
        return {
            doc: (id) => this.doc(name, id),
            add: async (data) => {
                const id = 'doc_' + Date.now();
                this.data[name][id] = data;
                this.save();
                return { id };
            },
            getDocs: async () => {
                const docs = Object.entries(this.data[name] || {}).map(([id, data]) => ({
                    id,
                    data: () => data,
                    exists: () => true
                }));
                return { docs };
            }
        };
    }

    doc(collection, id) {
        return {
            get: async () => {
                const data = this.data[collection]?.[id];
                return {
                    exists: () => !!data,
                    data: () => data,
                    id: id
                };
            },
            set: async (data) => {
                if (!this.data[collection]) {
                    this.data[collection] = {};
                }
                this.data[collection][id] = data;
                this.save();
            },
            update: async (data) => {
                if (!this.data[collection]) {
                    this.data[collection] = {};
                }
                this.data[collection][id] = {
                    ...this.data[collection][id],
                    ...data
                };
                this.save();
            },
            delete: async () => {
                if (this.data[collection]?.[id]) {
                    delete this.data[collection][id];
                    this.save();
                }
            }
        };
    }
}

export const mockAuth = new MockAuth();
export const mockDb = new MockFirestore();

// Helper functions to match Firebase API
export const doc = (db, collection, id) => {
    return { collection, id };
};

export const getDoc = async (docRef) => {
    return await mockDb.doc(docRef.collection, docRef.id).get();
};

export const setDoc = async (docRef, data) => {
    return await mockDb.doc(docRef.collection, docRef.id).set(data);
};

export const updateDoc = async (docRef, data) => {
    return await mockDb.doc(docRef.collection, docRef.id).update(data);
};

export const deleteDoc = async (docRef) => {
    return await mockDb.doc(docRef.collection, docRef.id).delete();
};

export const collection = (db, name) => {
    return { name };
};

export const addDoc = async (collectionRef, data) => {
    return await mockDb.collection(collectionRef.name).add(data);
};

export const getDocs = async (collectionRef) => {
    return await mockDb.collection(collectionRef.name).getDocs();
};

export const query = (collectionRef, ...constraints) => {
    // Simple implementation - just return the collection ref
    // In a real implementation, you'd apply the constraints
    return collectionRef;
};

export const where = (field, operator, value) => {
    return { field, operator, value };
};

export const orderBy = (field, direction = 'asc') => {
    return { field, direction };
};
