<script>
export default {
    data() {
        return {

        };
    }
};
</script>

<template>
    <div class="homepage">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-text">
                <p>Your playful and productive task management solution.</p>
                <h1>Welcome to FocusQuest</h1>
                <a href="#features" class="btn-primary">Explore Features</a>
            </div>
            <div class="hero-image">
                <img src="" alt="Task management illustration">
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features">
            <h2>Key Features</h2>
            <div class="feature-cards">
                <div class="card">
                    <h3>Task Prioritization</h3>
                    <p>Easily prioritize tasks based on urgency and deadlines.</p>
                </div>
                <div class="card">
                    <h3>Emotional Feedback</h3>
                    <p>Track your emotional state while working on tasks.</p>
                </div>
                <div class="card">
                    <h3>Gamified Progress</h3>
                    <p>Earn achievements as you complete tasks and reach your goals.</p>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about">
            <h2>About FocusQuest</h2>
            <p>
                FocusQuest is designed to help individuals, especially those with ADHD, stay organized,
                motivated, and in tune with their emotional well-being. It’s not just about getting things done,
                it’s about making the journey enjoyable and rewarding.
            </p>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <p>&copy; 2024 FocusQuest. All rights reserved.</p>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
/* Define variables for colors */
$primary-color: #5b61b9;
$secondary-color: #f4f4f9;
$text-color: #333;
$bg-light: #f0f0f0;
$white: #fff;

/* General Layout */
.homepage {
    font-family: 'Arial', sans-serif;
    color: $text-color;
    text-align: center;
    padding: 20px;

    .hero {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: $secondary-color;
        padding: 40px 20px;

        .hero-text {
            max-width: 50%;

            h1 {
                font-size: 3rem;
                color: $primary-color;
            }

            p {
                font-size: 1.2rem;
                margin: 20px 0;
            }

            .btn-primary {
                background-color: $primary-color;
                color: $white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
        }

        .hero-image img {
            max-width: 100%;
            height: auto;
        }
    }

    /* Features Section */
    .features {
        background-color: $bg-light;
        padding: 40px 20px;

        h2 {
            font-size: 2.5rem;
            margin-bottom: 30px;
        }

        .feature-cards {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;

            .card {
                background-color: $white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 300px;
                margin: 10px;

                h3 {
                    font-size: 1.5rem;
                    color: $primary-color;
                }

                p {
                    font-size: 1rem;
                }
            }
        }
    }

    /* About Section */
    .about {
        padding: 40px 20px;

        h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }

        p {
            font-size: 1.2rem;
        }
    }

    /* Footer */
    .footer {
        background-color: $text-color;
        color: $white;
        padding: 20px;
        text-align: center;
    }
}
</style>