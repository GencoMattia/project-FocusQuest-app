<script>
export default {
    data() {
        return {};
    }
};
</script>

<template>
    <div class="homepage container py-5">
        <!-- Hero Section -->
        <section class="hero d-flex flex-column-reverse flex-lg-row align-items-center bg-primary text-white p-5 rounded mb-5 shadow-lg">
            <div class="hero-text col-lg-6 mb-4 mb-lg-0">
                <p class="lead">Your playful and productive task management solution.</p>
                <h1 class="display-4">Welcome to FocusQuest</h1>
                <a href="#features" class="btn btn-light btn-lg mt-3">Explore Features</a>
            </div>
            <div class="hero-image col-lg-6">
                <img src="../assets/img/Jumbo-img.jpg" alt="Task management illustration" class="img-fluid rounded shadow-sm">
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="features bg-light py-5 rounded shadow-sm mb-5">
            <h2 class="text-center mb-5 text-primary">Key Features</h2>
            <div class="row gx-4 gy-4">
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h3 class="card-title text-primary">Task Prioritization</h3>
                            <p class="card-text">Easily prioritize tasks based on urgency and deadlines.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h3 class="card-title text-primary">Emotional Feedback</h3>
                            <p class="card-text">Track your emotional state while working on tasks.</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h3 class="card-title text-primary">Gamified Progress</h3>
                            <p class="card-text">Earn achievements as you complete tasks and reach your goals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about py-5 mb-5">
            <div class="container">
                <h2 class="text-center mb-4 text-accent">About FocusQuest</h2>
                <p class="text-center fs-5">
                    FocusQuest is designed to help individuals, especially those with ADHD, stay organized,
                    motivated, and in tune with their emotional well-being. It’s not just about getting things done,
                    it’s about making the journey enjoyable and rewarding.
                </p>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer bg-primary text-white py-3 text-center rounded">
            <p>&copy; 2024 FocusQuest. All rights reserved.</p>
        </footer>
    </div>
</template>


<style lang="scss" scoped>
/* Variabili per colori pastello */
$primary-color: #a3d8f4; // Soft pastel blue
$secondary-color: #fdf5e6; // Light pastel cream
$accent-color: #ffd5cd; // Warm pastel pink
$text-color: #4a4a4a;
$white: #fff;

.homepage {
    font-family: 'Poppins', sans-serif;
    color: $text-color;
    text-align: center;

    .hero {
        background: linear-gradient(135deg, $primary-color 30%, $accent-color 100%);
    }

    .features {
        background-color: $secondary-color;
    }

    .about {
        color: $text-color;

        .text-accent {
            color: $accent-color;
        }
    }

    .footer {
        background-color: $primary-color;
        color: $white;
    }
}
</style>
