// Physics constants and functions
const GRAVITY = 0.6;
const MAX_FALL_SPEED = 12;
const GROUND_FRICTION = 0.85;
const AIR_FRICTION = 0.95;

class Physics {
    static applyGravity(entity) {
        entity.velocityY += GRAVITY;
        entity.velocityY = Math.min(entity.velocityY, MAX_FALL_SPEED);
    }

    static applyFriction(entity, isOnGround) {
        const friction = isOnGround ? GROUND_FRICTION : AIR_FRICTION;
        entity.velocityX *= friction;
    }

    static updatePosition(entity) {
        entity.x += entity.velocityX;
        entity.y += entity.velocityY;
    }

    static checkPlatformCollision(entity, platforms) {
        let onGround = false;

        for (const platform of platforms) {
            if (checkCollision(entity, platform)) {
                // Vertical collision
                if (entity.velocityY > 0) {
                    // Falling down - land on platform
                    entity.y = platform.y - entity.height;
                    entity.velocityY = 0;
                    onGround = true;
                } else if (entity.velocityY < 0) {
                    // Jumping up - hit platform from below
                    entity.y = platform.y + platform.height;
                    entity.velocityY = 0;
                }
            }
        }

        return onGround;
    }
}
