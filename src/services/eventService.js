/**
 * Event Service
 * 
 * This service provides a simple event-driven communication system for the application.
 * It implements a publish-subscribe pattern that allows components to communicate
 * without direct dependencies. Components can subscribe to events and emit events
 * to notify other parts of the application about state changes or actions.
 * 
 * Key Features:
 * - Event subscription and unsubscription
 * - Event emission with data payload
 * - Automatic cleanup of listeners
 * - Singleton pattern for global access
 * 
 * @module eventService
 * @example
 * // Subscribe to an event
 * const unsubscribe = eventService.subscribe('cartUpdated', (data) => {
 *   console.log('Cart updated:', data);
 * });
 * 
 * // Emit an event
 * eventService.emit('cartUpdated', { itemCount: 5 });
 * 
 * // Unsubscribe when done
 * unsubscribe();
 */

/**
 * Event Service Class
 * 
 * Manages event subscriptions and emissions using a simple event bus pattern.
 * Provides methods to subscribe to events, emit events, and automatically
 * handle listener cleanup.
 * 
 * @class EventService
 */
class EventService {
    /**
     * Creates a new EventService instance
     * 
     * Initializes the service with an empty listeners object to store
     * event subscriptions.
     * 
     * @constructor
     * @example
     * const eventService = new EventService();
     */
    constructor() {
        /**
         * Object to store event listeners
         * @type {Object.<string, Array.<Function>>}
         * @private
         */
        this.listeners = {};
    }

    /**
     * Subscribes to an event
     * 
     * Registers a callback function to be executed when the specified event is emitted.
     * Returns an unsubscribe function that can be called to remove the listener.
     * 
     * @param {string} event - The name of the event to subscribe to
     * @param {Function} callback - Function to be called when the event is emitted
     * @returns {Function} Unsubscribe function to remove the listener
     * 
     * @example
     * const unsubscribe = eventService.subscribe('userLogin', (userData) => {
     *   console.log('User logged in:', userData);
     * });
     * 
     * // Later, to unsubscribe:
     * unsubscribe();
     */
    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        };
    }

    /**
     * Emits an event to all subscribed listeners
     * 
     * Notifies all registered listeners for the specified event by calling
     * their callback functions with the provided data.
     * 
     * @param {string} event - The name of the event to emit
     * @param {*} data - Data to pass to the event listeners
     * 
     * @example
     * eventService.emit('cartUpdated', { 
     *   itemCount: 3, 
     *   total: 150.00 
     * });
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

/**
 * Singleton instance of EventService
 * 
 * Provides global access to the event service throughout the application.
 * All components can use this instance to subscribe to and emit events.
 * 
 * @type {EventService}
 * @example
 * import { eventService } from './eventService';
 * 
 * // Subscribe to events
 * eventService.subscribe('productAdded', (product) => {
 *   updateCartIcon(product);
 * });
 * 
 * // Emit events
 * eventService.emit('productAdded', { id: 123, name: 'Product Name' });
 */
export const eventService = new EventService(); 